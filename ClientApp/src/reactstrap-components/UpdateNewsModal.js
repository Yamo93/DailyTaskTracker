import React, { useState, useEffect } from 'react';
import moment from 'moment';
import authService from '../components/api-authorization/AuthorizeService';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

const UpdateNewsModal = (props) => {
    const {
        buttonLabel,
        buttonColor,
        buttonSize,
        className
    } = props;
    const [id, setId] = useState(props.newsToBeUpdated.id);
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState(props.newsToBeUpdated.title);
    const [date, setDate] = useState(moment(props.newsToBeUpdated.createdDate).format('YYYY-MM-DD'));
    const [content, setContent] = useState(parseInt(props.newsToBeUpdated.content));
    const [user, setUser] = useState();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        setUser({ user });
    }

    const toggle = () => setModal(!modal);

    const updateNews = () => {
        // Form validation
        if (!content || !date || !title) {
            return;
        }

        authService.getAccessToken()
            .then(token => {
                const newsToBeUpdated = {
                    id,
                    createdDate: new Date(date),
                    title,
                    content,
                    userId: props.newsToBeUpdated.userId
                };

                fetch(`https://localhost:44370/api/ReleaseNews/${id}`, {
                    method: 'PUT',
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newsToBeUpdated)
                })
                    .catch(err => {
                        console.log(err);
                    })
                    .then(res => {
                        if (!res.ok) {
                            // Close modal
                            toggle();

                            // Show error
                            props.showAlertMessage('Failed to update news.', 'danger');

                            setTimeout(() => props.hideAlertMessage(), 6000);

                            return;
                        }

                        // Close modal
                        toggle();

                        // Show success
                        props.showAlertMessage('News are successfully updated.', 'success');

                        // Hide success
                        setTimeout(() => props.hideAlertMessage(), 6000);

                        // Fetch new tasks after adding task
                        props.fetchNews();
                    });

            });

    };

    return (
        <div>
            <Button color={buttonColor} size={buttonSize} onClick={toggle} className="mb-3">{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className} backdrop={true} keyboard={true}>
                <ModalHeader toggle={toggle}>Update news</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Task title"
                                onChange={e => setTitle(e.target.value)}
                                value={title}
                                valid={!!title}
                                invalid={!title}
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
                            <Label for="content">Content</Label>
                            <Input
                                type="text"
                                name="content"
                                id="content"
                                placeholder="Content"
                                defaultValue={content} 
                                onChange={e => setContent(e.target.value)}
                                valid={!!content}
                                invalid={!content}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={updateNews}>Update News</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default UpdateNewsModal;