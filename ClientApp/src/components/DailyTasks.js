import React, { Component } from 'react';
import moment from 'moment';
import { Table, Alert, Button } from 'reactstrap';
import authService from './api-authorization/AuthorizeService';
import AddTaskModal from '../reactstrap-components/AddTaskModal';
import UpdateTaskModal from '../reactstrap-components/UpdateTaskModal';
import DeleteTaskModal from '../reactstrap-components/DeleteTaskModal';
import Spinners from '../layout-components/Spinners';

export class DailyTask extends Component {
    static displayName = DailyTask.name;

    constructor(props) {
    super(props);
        this.state = {
            tasks: [],
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

    render() {
        const contents = this.state.loading ? <Spinners /> : (
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
                    {this.state.tasks.map(task =>
                        <tr key={task.id}>
                            <th scope="row">{task.description}</th>
                            <td>{moment(task.createdDate).format('dddd')} {moment(task.createdDate).format('YYYY-MM-DD')}</td>
                            <td>{task.timeSpentInHours}</td>
                            <td>{task.gitHubBranchUrl}</td>
                            <td>{task.trelloBoardUrl}</td>
                            <td>
                                <UpdateTaskModal postToBeUpdated={task} buttonLabel="Update" buttonColor="secondary" buttonSize="sm" fetchTasks={this.populateTaskData.bind(this)} showAlertMessage={this.showAlertMessage.bind(this)} hideAlertMessage={this.hideAlertMessage.bind(this)} />
                                <DeleteTaskModal postToBeDeleted={task} buttonLabel="Delete" buttonColor="danger" buttonSize="sm" fetchTasks={this.populateTaskData.bind(this)} showAlertMessage={this.showAlertMessage.bind(this)} hideAlertMessage={this.hideAlertMessage.bind(this)} />
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
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
        const sortedTasks = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        this.setState({
            tasks: sortedTasks,
            loading: false
        });
    }

    async fetchUserData() {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        this.setState({ user });
    }
}
