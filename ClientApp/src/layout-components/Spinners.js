import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const Spinners = (props) => {
    return (
        <div className="container">
            <Spinner animation="border" variant="primary" />
            <Spinner animation="border" variant="primary" />
            <Spinner animation="border" variant="primary" />
        </div>
    );
}

export default Spinners;