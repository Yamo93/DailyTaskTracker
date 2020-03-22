import React, { useState, useEffect } from 'react';
import moment from 'moment';
import authService from '../components/api-authorization/AuthorizeService';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

const DeleteTaskModal = (props) => {
    const {
        buttonLabel,
        buttonColor,
        buttonSize,
        className
    } = props;
    const [id, setId] = useState(props.postToBeDeleted.id);
    const [modal, setModal] = useState(false);
    const [description, setDescription] = useState(props.postToBeDeleted.description);
    const [date, setDate] = useState(moment(props.postToBeDeleted.createdDate).format('YYYY-MM-DD'));
    const [time, setTime] = useState(parseInt(props.postToBeDeleted.timeSpentInHours));
    const [gitHubBranchUrl, setGitHubBranchUrl] = useState(props.postToBeDeleted.gitHubBranchUrl);
    const [trelloBoardUrl, setTrelloBoardUrl] = useState(props.postToBeDeleted.trelloBoardUrl);
    const [user, setUser] = useState();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        setUser({ user });
    }

    const toggle = () => setModal(!modal);

    const deletePost = () => {
        authService.getAccessToken()
            .then(token => {
                fetch(`https://localhost:44370/api/DailyTasks/${id}`, {
                    method: 'DELETE',
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                    .catch(err => {
                        console.log(err);
                    })
                    .then(res => {
                        if (!res.ok) {
                            // Close modal
                            toggle();

                            // Show error
                            props.showAlertMessage('Failed to delete task.', 'danger');

                            setTimeout(() => props.hideAlertMessage(), 6000);

                            return;
                        }

                        // Close modal
                        toggle();

                        // Show success
                        props.showAlertMessage('Task is successfully deleted.', 'success');

                        // Hide success
                        setTimeout(() => props.hideAlertMessage(), 6000);

                        // Fetch new tasks after adding task
                        props.fetchTasks();
                    });

            });

    };

    return (
        <div>
            <Button color={buttonColor} size={buttonSize} onClick={toggle} className="mb-3">{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className} backdrop={true} keyboard={true}>
                <ModalHeader toggle={toggle}>Delete daily task</ModalHeader>
                <ModalBody>
                    <h5>Do you want to delete the following task?</h5>
                    <p><strong>Description:</strong> {description}</p>
                    <p><strong>Date:</strong> {moment(date).format('dddd')} {moment(date).format('YYYY-MM-DD')}</p>
                    <p><strong>Time spent (in hours):</strong> {time}</p>
                    <p><strong>GitHub Branch URL:</strong> {gitHubBranchUrl}</p>
                    <p><strong>Trello Board URL:</strong> {trelloBoardUrl}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={deletePost}>Delete Task</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default DeleteTaskModal;