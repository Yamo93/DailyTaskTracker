import React, { useState, useEffect } from 'react';
import moment from 'moment';
import authService from '../components/api-authorization/AuthorizeService';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

const UpdateTaskModal = (props) => {
    const {
        buttonLabel,
        buttonColor,
        buttonSize,
        className
    } = props;
    const [id, setId] = useState(props.postToBeUpdated.id);
    const [modal, setModal] = useState(false);
    const [description, setDescription] = useState(props.postToBeUpdated.description);
    const [date, setDate] = useState(moment(props.postToBeUpdated.createdDate).format('YYYY-MM-DD'));
    const [time, setTime] = useState(parseInt(props.postToBeUpdated.timeSpentInHours));
    const [gitHubBranchUrl, setGitHubBranchUrl] = useState(props.postToBeUpdated.gitHubBranchUrl);
    const [trelloBoardUrl, setTrelloBoardUrl] = useState(props.postToBeUpdated.trelloBoardUrl);
    const [user, setUser] = useState();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        setUser({ user });
    }

    const toggle = () => setModal(!modal);

    const updatePost = () => {
        // Form validation
        if (!description || !date || !time) {
            return;
        }

        authService.getAccessToken()
            .then(token => {
                const postToBeUpdated = {
                    id,
                    createdDate: new Date(date),
                    description,
                    timeSpentInHours: time,
                    gitHubBranchUrl,
                    trelloBoardUrl,
                    userId: props.postToBeUpdated.userId
                };

                fetch(`https://localhost:44370/api/DailyTasks/${id}`, {
                    method: 'PUT',
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postToBeUpdated)
                })
                    .catch(err => {
                        console.log(err);
                    })
                    .then(res => {
                        if (!res.ok) {
                            // Close modal
                            toggle();

                            // Show error
                            props.showAlertMessage('Failed to update task.', 'danger');

                            setTimeout(() => props.hideAlertMessage(), 6000);

                            return;
                        }

                        // Close modal
                        toggle();

                        // Show success
                        props.showAlertMessage('Task is successfully updated.', 'success');

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
                <ModalHeader toggle={toggle}>Update daily task</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                id="description"
                                placeholder="Task description"
                                onChange={e => setDescription(e.target.value)}
                                value={description}
                                valid={!!description}
                                invalid={!description}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="date">Date</Label>
                            <Input
                                type="date"
                                name="date"
                                id="date"
                                placeholder="Date"
                                value={date}
                                onChange={e => setDate(moment(e.target.value).format('YYYY-MM-DD'))}
                                valid={!!date}
                                invalid={!date}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="time">Time spent (hours)</Label>
                            <Input
                                type="number"
                                name="time"
                                id="time"
                                placeholder="Time spent"
                                defaultValue={time} 
                                onChange={e => setTime(parseInt(e.target.value))}
                                valid={!!time}
                                invalid={!time}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="githubbranch">GitHub Branch URL</Label>
                            <Input type="text"
                                name="githubbranch"
                                id="githubbranch"
                                placeholder="GitHub Branch URL"
                                defaultValue={gitHubBranchUrl} 
                                onChange={e => setGitHubBranchUrl(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="trelloboard">Trello Board URL</Label>
                            <Input type="text"
                                name="trelloboard"
                                id="trelloboard"
                                placeholder="Trello Board URL"
                                defaultValue={trelloBoardUrl}
                                onChange={e => setTrelloBoardUrl(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={updatePost}>Update Task</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default UpdateTaskModal;