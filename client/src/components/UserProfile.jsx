import { useEffect, useState, useContext } from 'react';
import { Button, Modal, NavLink } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { LiaCrownSolid } from "react-icons/lia";


// local imports
import styles from '../stylesheets/UserProfile.module.css';
import { OutletContext } from './App';
import EditProfile from './EditProfile';

const UserProfile = () => {
    const { id } = useParams();
    const { setShowAlert, loggedInUser } = useContext(OutletContext);
    const [user, setUser] = useState(null);
    const [editProfile, setEditProfile] = useState(false);
    const [editedUser, setEditedUser] = useState(null);
    const [formErrors, setFormErrors] = useState([]);


   
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
                
                    setUser(user);
                    setEditedUser(user);
                })
                .catch((err) => {
                    console.log("Error getting user data:", err);
                });
        }
    }, [id]);
    // loggedInUser ? console.log(loggedInUser['first_name']) : console.log('no user')

    // profile creation date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }


    //  Edit user profile functions lines 58-97
    function handleEditProfileClick() {
        setEditProfile(!editProfile);
    }

    // Delete user profile functions lines 100-118
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
    // console.log('User Object:', user)
    // console.log("user's bookclubs:", user?.book_clubs_owned)

//     const get_book_club = (book_clubs) => {
//     if (book_clubs?.length > 0) {
//         for (const book_club of book_clubs) {
//             console.log(book_club.name);
//         }
//     }
// }
    // get_book_club(user?.book_clubs)

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
                {loggedInUser && loggedInUser.id === user.id ? (
                    <div>
                    <Button onClick={handleEditProfileClick}>
                        {!editProfile ? "Edit Profile" : "Cancel" } 
                    </Button>
                    <Button>
                        <NavLink href={`/create_book_club`}>
                            Create a Book Club
                        </NavLink>
                    </Button>
                    </div>
                    ) : 
                    ( <div></div> )
                }
            </div>
            {editProfile ? (
            <div>
                <EditProfile loggedInUser={loggedInUser} user={user} setUser={setUser} editedUser={editedUser} setEditedUser={setEditedUser} />
                <Button variant="secondary" size="sm" onClick={handleShow}>
                    Delete your account
                </Button>
                <MyModal
                    show={deleteModalShow}
                    onHide={() => setDeleteModalShow(false)}
                />  
            </div> ) : 
            ( <div></div> )
        }
        <div className={styles.lists_container}>
                <div >
                    <h5>{`${user.first_name}'s Clubs:`}</h5>
                    <ul className={styles.users_lists}>
                        {user?.book_clubs_owned.map((book_club, idx) => (
                            <li key={idx}>
                            
                            <NavLink href={`/bookclubs/${book_club.id}`}>
                                <LiaCrownSolid />
                                {book_club.name}
                            </NavLink>
                            </li>
                        ))}
                        {user?.book_clubs.map((book_club, idx) => (
                            <li key={idx}>
                            <NavLink href={`/bookclubs/${book_club.id}`}>
                                {book_club.name}
                            </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>   
        </div>
        </div>
    );
};
}

export default UserProfile;
