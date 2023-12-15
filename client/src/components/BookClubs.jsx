import { useEffect, useState, useContext } from "react"
import { Row, Col, Card, Button } from "react-bootstrap"
import { NavLink } from "react-router-dom"

// local imports
import { OutletContext } from './App'


function BookClubs() {
    const { bookClubs } = useContext(OutletContext)
    console.log(bookClubs)
    const clubsToRender = bookClubs || [];

    return (
        <Row xs={2} md={3} lg={4} className="g-5">
        {clubsToRender.map((bookClub, idx) => (
            <Col key={idx}>
                <Card style={{width: '18rem',}}>
                    <Card.Img variant="top" src={bookClub.avatar_url ? bookClub.avatar_url : "/src_images/placeholder_bookclub_avatar.jpeg"} alt="club's profile pic"  />
                    <Card.Body className="d-inline-block" style={{maxHeight: '286px'}}>
                        {/* maybe do a character length check to set font size? */}
                        <Card.Title>{bookClub.name}</Card.Title>
                        <Card.Text className="text-truncate">
                            {bookClub.description}
                        </Card.Text>
                        <Button variant="primary"> <NavLink to={`/bookclubs/${bookClub.id}`}>Learn More</NavLink></Button>
                    </Card.Body>
                </Card>
            </Col>
        ))}
        </Row>
    );
}

export default BookClubs