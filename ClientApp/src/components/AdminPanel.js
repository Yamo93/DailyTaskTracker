import React, { Component } from 'react';
import moment from 'moment';
import { Table, Alert, Button } from 'reactstrap';
import authService from './api-authorization/AuthorizeService';
import AddNewsModal from '../reactstrap-components/AddNewsModal';
import UpdateNewsModal from '../reactstrap-components/UpdateNewsModal';
import DeleteNewsModal from '../reactstrap-components/DeleteNewsModal';
import DailyTaskPagination from '../reactstrap-components/DailyTaskPagination';
import Spinners from '../layout-components/Spinners';

export class AdminPanel extends Component {
    static displayName = AdminPanel.name;

    constructor(props) {
        super(props);
        this.state = {
            news: [],
            currentPage: 1,
            paginatedNews: {},
            newsPerPage: 5,
            numberOfPages: 0,
            arrayWithPageNumbers: [],
            loading: true,
            user: null,
            alertMessage: null
        };
    }

    componentDidMount() {
        this.populateNewsData();
        this.fetchUserData();
    }

    showAlertMessage(text, color) {
        this.setState({
            alertMessage: {
                text,
                color
            }
        });
    }

    hideAlertMessage() {
        this.setState({ alertMessage: null });
    }

    goToPreviousPage() {
        this.setState(prevState => {
            return {
                ...prevState,
                currentPage: prevState.currentPage > 1 ? prevState.currentPage - 1 : prevState.currentPage
            };
        });
    }

    goToNextPage() {
        this.setState(prevState => {
            return {
                ...prevState,
                currentPage: prevState.currentPage === prevState.numberOfPages ? prevState.currentPage : prevState.currentPage + 1
            };
        });
    }

    setCurrentPage = pageNumber => {
        this.setState(prevState => {
            return {
                ...prevState,
                currentPage: pageNumber
            };
        });
    }

    render() {
        const contents = this.state.loading ? <Spinners /> : (
            <>
                <DailyTaskPagination
                    arrayWithPageNumbers={this.state.arrayWithPageNumbers}
                    currentPage={this.state.currentPage}
                    goToNextPage={this.goToNextPage.bind(this)}
                    goToPreviousPage={this.goToPreviousPage.bind(this)}
                    setCurrentPage={pageNumber => this.setCurrentPage(pageNumber)}
                />
                <Table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Date</th>
                            <th>Content</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.paginatedNews).length > 0 ? this.state.paginatedNews[this.state.currentPage].map(news =>
                            <tr key={news.id}>
                                <th scope="row">{news.title}</th>
                                <td>{moment(news.createdDate).format('dddd')} {moment(news.createdDate).format('YYYY-MM-DD')}</td>
                                <td>{news.content}</td>
                                <td>
                                    <UpdateNewsModal newsToBeUpdated={news} buttonLabel="Update" buttonColor="secondary" buttonSize="sm" fetchNews={this.populateNewsData.bind(this)} showAlertMessage={this.showAlertMessage.bind(this)} hideAlertMessage={this.hideAlertMessage.bind(this)} />
                                    <DeleteNewsModal newsToBeDeleted={news} buttonLabel="Delete" buttonColor="danger" buttonSize="sm" fetchNews={this.populateNewsData.bind(this)} showAlertMessage={this.showAlertMessage.bind(this)} hideAlertMessage={this.hideAlertMessage.bind(this)} />
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </Table>
            </>
        );

        const userName = this.state.user ? this.state.user.preferred_username : '...';
        const message = this.state.alertMessage ? <Alert color={this.state.alertMessage.color}>{this.state.alertMessage.text}</Alert> : this.state.alertMessage;

        return (
            <div>
                {message}
                <AddNewsModal buttonLabel="Add news" buttonColor="primary" fetchNews={this.populateNewsData.bind(this)} showAlertMessage={this.showAlertMessage.bind(this)} hideAlertMessage={this.hideAlertMessage.bind(this)} />
                <h3 className="mb-3">Release News</h3>
                {contents}
            </div>
        )
    }

    async populateNewsData() {
        const token = await authService.getAccessToken();
        const response = await fetch('https://localhost:44370/api/ReleaseNews/', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        // Sort tasks
        const sortedNews = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

        // Paginate tasks
        const numberOfPages = Math.ceil(sortedNews.length / this.state.newsPerPage);
        const copiedNews = [...sortedNews];
        const paginatedNews = {};
        const arrayWithPageNumbers = [];

        for (let i = 1; i <= numberOfPages; i++) {
            arrayWithPageNumbers.push(i);
        }

        for (const page of arrayWithPageNumbers) {
            paginatedNews[page] = [];
            for (let i = 0; i < this.state.newsPerPage; i++) {
                if (copiedNews[0]) { // Making sure its not undefined
                    paginatedNews[page].push(copiedNews.shift());
                }
            }
        }

        this.setState({
            tasks: sortedNews,
            paginatedNews,
            arrayWithPageNumbers,
            numberOfPages,
            loading: false
        });
    }

    async fetchUserData() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        this.setState({ user });
    }
}
