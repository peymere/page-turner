import { useEffect, useState, useContext } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';

// local imports
import styles from '../stylesheets/UserProfile.module.css';
import { OutletContext } from './App';



const UserProfile = () => {
    const { id } = useParams();
    const { setShowAlert } = useContext(OutletContext);
    const [user, setUser] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    
    const navigate = useNavigate();

    // Modal States
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const handleClose = () => setDeleteModalShow(false);
    const handleShow = () => setDeleteModalShow(true);



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
                    // console.log(user);
                    setUser(user);
                    setEditedUser(user);
                })
                .catch((err) => {
                    console.log("Error getting user data:", err);
                });
        }
    }, [id]);

    // profile creation date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    //  Edit user profile functions lines 53-91
    function handleEditProfileClick() {
        setEditProfile(!editProfile);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editedUser !== null) {
            setEditedUser({ ...editedUser, [name]: value });
        }
    }

    function handleEditProfileSubmit(e) {
        e.preventDefault();
        const changedFields = Object.fromEntries(
            Object.entries(editedUser).filter(([key, value]) => user[key] !== value)
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
                    throw Error('Failed to update user');
                }
                return r.json();
            })
            .then((updatedUser) => {
                setUser(updatedUser);
                console.log('Previous editedUser state:', editedUser);
                setEditedUser(updatedUser);
                console.log('New editedUser state:', editedUser);
                setEditProfile(false);
                console.log('User updated successfully', updatedUser);
            })
            .catch((error) => console.error('Error updating user:', error));
    }

    // Delete user profile functions lines 93-122
    

    function handleDeleteProfile() {
        
        fetch(`/users/${id}`, {
            method: 'DELETE',
        })
            .then((r) => {
                if (!r.ok) {
                    throw Error('Failed to delete user');
                }
                return r.json();
            })
            .then((deletedUser) => {
                console.log('User deleted successfully', deletedUser);
            })
            .catch((error) => console.error('Error deleting user:', error));
        handleClose();
        navigate('/');
        setShowAlert(true);
    }

    // Defining delete profile Modal component
    function MyModal(props) {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Delete your account
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Are you sure you want to delete your account?</h4>
                    <p>
                    This action cannot be undone. You will lose all of your account information including your bookshelf and book club memberships.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleDeleteProfile}>
                        Yes, delete my account
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    if (!user) {
        <h1> User not found </h1>
    }

    else {

    return (
        <div className={styles.profile_container}>

            <div className={styles.profile_components}>
            <div >
                <img 
                    src={user.profile_pic ? user.profile_pic : "/src_images/placeholder-prof-pic.png"} 
                    alt="profile pic" 
                    className={styles.profile_pic}
                />
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
                        <Form.Check type="checkbox" label="Confirm Changes" />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                <Button variant="secondary" size="sm" onClick={handleShow}>
                    Delete your account
                </Button>
                <MyModal
                    show={deleteModalShow}
                    onHide={() => setDeleteModalShow(false)}
                />
                
            </div>
            
        ) : (
            <div></div>
        )}
            
        </div>
        </div>
    );

};
}

export default UserProfile;
