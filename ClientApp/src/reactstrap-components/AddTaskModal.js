import React, { useState, useEffect } from 'react';
import moment from 'moment';
import authService from '../components/api-authorization/AuthorizeService';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup, FormText } from 'reactstrap';

const AddTaskModal = (props) => {
    const {
        buttonLabel,
        buttonColor,
        buttonSize,
        className
    } = props;
    const [modal, setModal] = useState(false);
    const [description, setDescription] = useState();
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(1);
    const [gitHubBranchUrl, setGitHubBranchUrl] = useState();
    const [trelloBoardUrl, setTrelloBoardUrl] = useState();
    const [user, setUser] = useState();
    const [valid, setValid] = useState();
    const [isDescriptionInvalid, setIsDescriptionInvalid] = useState();
    const [isDateInvalid, setIsDateInvalid] = useState();
    const [isTimeInvalid, setIsTimeInvalid] = useState();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        setUser({ user });
    }

    const toggle = () => setModal(!modal);

    const addPost = async () => {
        // Form validation
        if (!description || !date || !time) {
            return;
        }

        const token = await authService.getAccessToken();
        const postToBeAdded = {
            createdDate: date,
            description,
            timeSpentInHours: time,
            gitHubBranchUrl,
            trelloBoardUrl,
            userId: user.sub

        };
        const response = await fetch('https://localhost:44370/api/DailyTasks/', {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postToBeAdded)
        })
            .then(res => {
                // Clear inputs
                setDescription();
                setDate(new Date());
                setTime();
                setGitHubBranchUrl();
                setTrelloBoardUrl();

                // Close modal
                toggle();

                // Show success
                props.showAlertMessage('Task is successfully added.', 'success');

                setTimeout(() => props.hideAlertMessage(), 3000);

                // Fetch new tasks after adding task
                props.fetchTasks();
            })
            .catch(err => {
                // Show error
                props.showAlertMessage('Failed to add task.', 'danger');

                setTimeout(() => props.hideAlertMessage(), 3000);
            });
    };

    return (
        <div>
            <Button color={buttonColor} size={buttonSize} onClick={toggle} className="mb-3">{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className} backdrop={true} keyboard={true}>
                <ModalHeader toggle={toggle}>Add a daily task</ModalHeader>
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
                                defaultValue={moment(date).format('YYYY-MM-DD')}
                                onChange={e => setDate(new Date(e.target.value))}
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
                                placeholder="GitHub Branch"
                                defaultValue={gitHubBranchUrl}
                                onChange={e => setGitHubBranchUrl(e.target.value)}
                            />
                            <FormText>This field is not required.</FormText>
                        </FormGroup>
                        <FormGroup>
                            <Label for="trelloboard">Trello Board URL</Label>
                            <Input type="text"
                                name="trelloboard"
                                id="trelloboard"
                                placeholder="Trello Board"
                                defaultValue={trelloBoardUrl}
                                onChange={e => setTrelloBoardUrl(e.target.value)}
                            />
                            <FormText>This field is not required.</FormText>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={addPost}>Add Task</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default AddTaskModal;