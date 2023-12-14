import React from "react";
import { NavItem } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


function BookClubCard({ bookClub }) {
    // console.log('bookclub card:', bookClub)
    const name = bookClub.name
    const description = bookClub.description
    const avatar_url = bookClub.avatar_url
    const created_at = bookClub.created_at
    const owner = bookClub.owner


    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={avatar_url ? avatar_url : "/src_images/placeholder_bookclub_avatar.jpeg"} alt="profile pic"  />
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>
                {description}
                </Card.Text>
                <Button variant="primary">Learn More</Button>
            </Card.Body>
        </Card>
    )

    
}

export default BookClubCard;