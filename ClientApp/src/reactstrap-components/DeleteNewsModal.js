import React, { useState, useEffect } from 'react';
import moment from 'moment';
import authService from '../components/api-authorization/AuthorizeService';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

const DeleteNewsModal = (props) => {
    const {
        buttonLabel,
        buttonColor,
        buttonSize,
        className
    } = props;
    const [id, setId] = useState(props.newsToBeDeleted.id);
    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState(props.newsToBeDeleted.title);
    const [date, setDate] = useState(moment(props.newsToBeDeleted.createdDate).format('YYYY-MM-DD'));
    const [content, setContent] = useState(parseInt(props.newsToBeDeleted.content));
    const [user, setUser] = useState();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);
        setUser({ user });
    }

    const toggle = () => setModal(!modal);

    const deleteNews = () => {
        authService.getAccessToken()
            .then(token => {
                fetch(`https://localhost:44370/api/ReleaseNews/${id}`, {
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
                            props.showAlertMessage('Failed to delete news.', 'danger');

                            setTimeout(() => props.hideAlertMessage(), 6000);

                            return;
                        }

                        // Close modal
                        toggle();

                        // Show success
                        props.showAlertMessage('News are successfully deleted.', 'success');

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
                <ModalHeader toggle={toggle}>Delete news</ModalHeader>
                <ModalBody>
                    <h5>Do you want to delete the following news?</h5>
                    <p><strong>Title:</strong> {title}</p>
                    <p><strong>Date:</strong> {moment(date).format('dddd')} {moment(date).format('YYYY-MM-DD')}</p>
                    <p><strong>Content:</strong> {content}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={deleteNews}>Delete News</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default DeleteNewsModal;