import { useEffect, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import { useFormik } from 'formik';

// local imports
import { createEditProfileSchema } from '../yupSchemas';

const EditProfile = ({ loggedInUser, user, setUser, editedUser, setEditedUser }) => {
    const { id } = useParams();
    const [formErrors, setFormErrors] = useState(null);

    const editProfileSchema = createEditProfileSchema(loggedInUser);

    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            profile_pic: '',
            about_me: '',
        },
        validationSchema: editProfileSchema,
        onSubmit: (values, {resetForm}) => {
            // console.log(values);
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editedUser !== null) {
            setEditedUser({ ...editedUser, [name]: value });
        }
    }

    function handleEditProfileSubmit(e) {
        e.preventDefault();
        const changedFields = Object.fromEntries(
            Object.entries(editedUser).filter(([key, value]) => loggedInUser[key] !== value)
        );

        fetch(`/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changedFields),
        })
            .then((r) => {
                if (!r.ok) {
                    r.json().then(({errors}) => {
                    setFormErrors(errors)
                }); }
                else {
                    r.json().then((updatedUser) => {
                        setUser(updatedUser);
                        setEditedUser(updatedUser);
                        setFormErrors(null);
                        console.log('User updated successfully', updatedUser);
                    });
                }
            })
    }
    
    return(
        <div>
                <h3>Edit Profile</h3>
                <Form onSubmit={handleEditProfileSubmit}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formFirstName">
                            <Form.Label visuallyHidden>First Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder={`${user['first_name']}`} 
                                onChange={handleInputChange}
                                name="first_name"
                            />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formLastName">
                            <Form.Label visuallyHidden>Last Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder={`${user['last_name']}`}
                                onChange={handleInputChange}
                                name="last_name" 
                            />
                        </Form.Group>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formEmail">
                            <Form.Label visuallyHidden>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder={`${user.email}`}
                                onChange={handleInputChange}
                                name="email" 
                            />
                        </Form.Group>

                        <InputGroup as={Col} controlId="formUsername">
                            <Form.Label visuallyHidden>Username</Form.Label>
                            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                            <Form.Control 
                                type="text" 
                                placeholder={`${user.username}`} 
                                onChange={handleInputChange}
                                name="username"
                            />
                        </InputGroup>
                    </Row>

                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formEditPassword">
                        <Form.Label visuallyHidden>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            placeholder="New password" 
                            onChange={handleInputChange}
                            name="password"
                        />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formEditConfirmPassword">
                        <Form.Label visuallyHidden>Confirm password</Form.Label>
                        <Form.Control type="password" placeholder="Confirm new password" />
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formEditPic">
                        <Form.Label visuallyHidden>Profile Picture</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter image URL" 
                            onChange={handleInputChange}
                            name="profile_pic"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEditBio">
                        <Form.Label visuallyHidden>About Me</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Tell us about yourself..."
                            onChange={handleInputChange}
                            name="about_me"    
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" id="formConfirmCheckbox">
                        <Form.Check type="checkbox" label="Confirm Changes" required />
                    </Form.Group>
                    {formErrors ? 
                        (
                            <p style={{ color: "red" }}> {formErrors} </p>
                        ) : null}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
    )
}

export default EditProfile;