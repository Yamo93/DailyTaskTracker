import React, { Component } from 'react';
import moment from 'moment';
import { Table, Alert, Button } from 'reactstrap';
import authService from './api-authorization/AuthorizeService';
import AddTaskModal from '../reactstrap-components/AddTaskModal';
import UpdateTaskModal from '../reactstrap-components/UpdateTaskModal';
import DeleteTaskModal from '../reactstrap-components/DeleteTaskModal';
import DailyTaskPagination from '../reactstrap-components/DailyTaskPagination';
import Spinners from '../layout-components/Spinners';

export class DailyTasks extends Component {
    static displayName = DailyTasks.name;

    constructor(props) {
    super(props);
        this.state = {
            tasks: [],
            currentPage: 1,
            paginatedTasks: {},
            tasksPerPage: 5,
            numberOfPages: 0,
            arrayWithPageNumbers: [],
            loading: true,
            user: null,
            alertMessage: null
        };
    }

    componentDidMount() {
        this.populateTaskData();
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
                            <th>Description</th>
                            <th>Date</th>
                            <th>Time spent (hours)</th>
                            <th>GitHub Branch</th>
                            <th>Trello Board</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(this.state.paginatedTasks).length > 0 ? this.state.paginatedTasks[this.state.currentPage].map(task =>
                            <tr key={task.id}>
                                <th scope="row">{task.description}</th>
                                <td>{moment(task.createdDate).format('dddd')} {moment(task.createdDate).format('YYYY-MM-DD')}</td>
                                <td>{task.timeSpentInHours}</td>
                                <td><a href={task.gitHubBranchUrl} target="_blank">{task.gitHubBranchUrl ? 'Link to GitHub branch' : ''}</a></td>
                                <td><a href={task.trelloBoardUrl} target="_blank">{task.trelloBoardUrl ? 'Link to Trello board' : ''}</a></td>
                                <td>
                                    <UpdateTaskModal postToBeUpdated={task} buttonLabel="Update" buttonColor="secondary" buttonSize="sm" fetchTasks={this.populateTaskData.bind(this)} showAlertMessage={this.showAlertMessage.bind(this)} hideAlertMessage={this.hideAlertMessage.bind(this)} />
                                    <DeleteTaskModal postToBeDeleted={task} buttonLabel="Delete" buttonColor="danger" buttonSize="sm" fetchTasks={this.populateTaskData.bind(this)} showAlertMessage={this.showAlertMessage.bind(this)} hideAlertMessage={this.hideAlertMessage.bind(this)} />
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
                <AddTaskModal buttonLabel="Add a task" buttonColor="primary" fetchTasks={this.populateTaskData.bind(this)} showAlertMessage={this.showAlertMessage.bind(this)} hideAlertMessage={this.hideAlertMessage.bind(this)} />
                <h3 className="mb-3">Daily Tasks for <span className="text-primary">{userName}</span></h3>
                {contents}
            </div>
            )
    }

    async populateTaskData() {
        const token = await authService.getAccessToken();
        const response = await fetch('https://localhost:44370/api/DailyTasks/', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        // Sort tasks
        const sortedTasks = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

        // Paginate tasks
        const numberOfPages = Math.ceil(sortedTasks.length / this.state.tasksPerPage);
        const copiedTasks = [...sortedTasks];
        const paginatedTasks = {};
        const arrayWithPageNumbers = [];

        for (let i = 1; i <= numberOfPages; i++) {
            arrayWithPageNumbers.push(i);
        }

        for (const page of arrayWithPageNumbers) {
            paginatedTasks[page] = [];
            for (let i = 0; i < this.state.tasksPerPage; i++) {
                if (copiedTasks[0]) { // Making sure its not undefined
                    paginatedTasks[page].push(copiedTasks.shift());
                }
            }
        }

        this.setState({
            tasks: sortedTasks,
            paginatedTasks,
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
