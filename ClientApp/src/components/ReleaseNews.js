import React from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';

const ReleaseNews = (props) => {
    return (
        <>
        <h3>Release News</h3>
        <ListGroup>
            <ListGroupItem>
                    <ListGroupItemHeading>List group item heading</ListGroupItemHeading>
                    <p className="text-muted">2020-02-02 by <em>Yamo Gebrewold</em></p>
                    <hr />
                <ListGroupItemText>
                    Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.
            </ListGroupItemText>
                </ListGroupItem>
        </ListGroup>
        </>
    );
}

export default ReleaseNews;