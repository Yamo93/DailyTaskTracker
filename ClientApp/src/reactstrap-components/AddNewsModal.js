import React, { useState, useEffect } from 'react';
import moment from 'moment';
import authService from '../components/api-authorization/AuthorizeService';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup, FormText } from 'reactstrap';

const AddNewsModal = (props) => {
    const {
        buttonLabel,
        buttonColor,
        buttonSize,
        className
    } = props;
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState();
    const [content, setContent] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        setUser({ user });
    }

    const toggle = () => setModal(!modal);

    const addNews = async () => {
        // Form validation
        if (!title || !content) {
            return;
        }

        const token = await authService.getAccessToken();
        const newsToBeAdded = {
            title,
            content,
            userId: user.sub

        };
        const response = await fetch('https://localhost:44370/api/ReleaseNews/', {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsToBeAdded)
        })
            .then(res => {
                // Clear inputs
                setTitle();
                setDate(new Date());
                setContent();

                // Close modal
                toggle();

                // Show success
                props.showAlertMessage('News are successfully added.', 'success');

                setTimeout(() => props.hideAlertMessage(), 3000);

                // Fetch new news after adding task
                props.fetchNews();
            })
            .catch(err => {
                // Show error
                props.showAlertMessage('Failed to add news.', 'danger');

                setTimeout(() => props.hideAlertMessage(), 3000);
            });
    };

    return (
        <div>
            <Button color={buttonColor} size={buttonSize} onClick={toggle} className="mb-3">{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className} backdrop={true} keyboard={true}>
                <ModalHeader toggle={toggle}>Add news</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Title"
                                onChange={e => setTitle(e.target.value)}
                                valid={!!title}
                                invalid={!title}
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
                    <Button color="primary" onClick={addNews}>Add News</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default AddNewsModal;