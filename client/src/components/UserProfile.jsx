import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [editProfile, setEditProfile] = useState(false);

    useEffect(() => {
        if (id) {
            fetch(`/users/${id}`)
                .then((resp) => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error('Not logged in');
                    }
                })
                .then((user) => {
                    console.log(user);
                    setUser(user);
                })
                .catch((err) => {
                    console.log("Error getting user data:", err);
                });
        }
    }, [id]);

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function handleEditProfileClick() {
        setEditProfile(!editProfile);
    }

    if (!user) {
        <h1> User not found </h1>
    }

    else {

    return (
        <div>
            
            <div>
                <h2>{`${user['first_name']}'s Profile`}</h2>
                <h3>@{user.username}</h3>
                <h6>Member since {formatDate(user.created_at)}</h6>
                <Button onClick={handleEditProfileClick}>
                   {!editProfile ? "Edit Profile" : "Cancel" } 
                </Button>
            </div>
            {editProfile ? (
            <div>
                <h3>Edit Profile</h3>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formFirstName">
                            <Form.Label visuallyHidden>First Name</Form.Label>
                            <Form.Control type="text" placeholder={`${user['first_name']}`} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formLastName">
                            <Form.Label visuallyHidden>Last Name</Form.Label>
                            <Form.Control type="text" placeholder={`${user['last_name']}`} />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formEmail">
                            <Form.Label visuallyHidden>Email</Form.Label>
                            <Form.Control type="email" placeholder={`${user.email}`} />
                        </Form.Group>

                        <InputGroup as={Col} controlId="formUsername">
                            <Form.Label visuallyHidden>Username</Form.Label>
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <Form.Control type="text" placeholder={`${user.username}`} />
                        </InputGroup>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formEditPassword">
                        <Form.Label visuallyHidden>Password</Form.Label>
                        <Form.Control type="password" placeholder="New password" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formEditConfirmPassword">
                        <Form.Label visuallyHidden>Confirm password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm new password" />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formEditPic">
                        <Form.Label visuallyHidden>Profile Picture</Form.Label>
                        <Form.Control type="text" placeholder="Enter image URL" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEditBio">
                        <Form.Label visuallyHidden>About Me</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Tell us about yourself..." />
                    </Form.Group>

                    

                    <Form.Group className="mb-3" id="formConfirmCheckbox">
                        <Form.Check type="checkbox" label="Confirm Changes" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        ) : (
            <div></div>
        )}
            

        </div>
    );

};
}

export default UserProfile;
