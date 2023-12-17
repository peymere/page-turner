import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate, NavLink, Link } from "react-router-dom"
import { Outlet } from "react-router-dom";
import {Button, Modal, Breadcrumb} from 'react-bootstrap'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// local imports
import { OutletContext } from './App'
import ClubMembers from "./ClubMembers";
import styles from '../stylesheets/ClubProfile.module.css'
import ClubContext from "./ClubContext";

function ClubProfile() {
    const { id } = useParams();
    const { loggedInUser, bookClubs } = useContext(OutletContext)
    const [club, setClub] = useState(null);
    const [joinModalShow, setJoinModalShow] = useState(false);
    const [leaveModalShow, setLeaveModalShow] = useState(false);
    const [joinErrors, setJoinErrors] = useState(null);
    const [leaveErrors, setLeaveErrors] = useState(null);
    const [bookClubUser, setBookClubUser] = useState(null);

    // Modal button functions
    function handleJoinShow() {
        setJoinErrors(null)
        setLeaveErrors(null)
        setJoinModalShow(true)
    }
    function handleJoinClose() {
        setJoinModalShow(false)
    }
    function handleLeaveShow() {
        setJoinErrors(null)
        setLeaveErrors(null)
        setLeaveModalShow(true)
    }
    function handleLeaveClose() {
        setLeaveModalShow(false)
    }

    // get club data
    useEffect(() => {
        if (id) {
            fetch(`/bookclubs/${id}`)
                .then((resp) => {
                    if (resp.ok) {
                        return resp.json();
                    } else {
                        throw new Error('No bookclub found');
                    }
                })
                .then((club) => {
                    setClub(club);
                })
                .catch((err) => {
                    console.log("Error getting club data:", err);
                });
        }
    }, [id]);
    // club creation date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Join Club
    const handleJoinClub = () => {
        setJoinModalShow(false)
        // checks if user is logged in
        if (!loggedInUser) {
            setJoinErrors("You must be logged in to join a club");
            return;
        }
        // checks if user is already a member
        if (club.members.some(member => member.id === loggedInUser.id) || club.owner.id === loggedInUser.id) {
            setJoinErrors("You are already a member of this club");
            return;
        }
        else {
            fetch('/bookclubsusers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: loggedInUser?.id,
                    book_club_id: club?.id
                }),
            }).then((r) => {
                if (r.ok) {
                    r.json().then((bookClubUser) => {
                        console.log("Book Club User created successfully", bookClubUser)
                        setJoinErrors(null)
                    })
                } else {
                    r.json().then((err) => {
                        setJoinErrors(err.error)
                    })
                }
            })
        }  
    } 

    // Leave Club
    const handleLeaveClub = () => {
        setLeaveModalShow(false)
        // checks if user is logged in
        if (!loggedInUser) {
            setLeaveErrors("You must be logged in to leave a club");
            return;
        }
        // checks if user is already a member
        if (!club.members.some(member => member.id === loggedInUser.id)) {
            setLeaveErrors("You are not a member of this club");
            return;
        }
        else {
            fetch(`/bookclubsusers/${loggedInUser.id}/${club.id}`, {
                method: 'DELETE',
            })
                .then((r) => {
                    if (!r.ok) {
                        throw Error('Failed to delete club member');
                    }
                    return r.json();
                })
                .then((deletedUser) => {
                    console.log('Member deleted successfully', deletedUser);
                    setLeaveErrors(null)
                })
                .catch((error) => console.error('Error deleting ,member:', error));
        }
    }

    // Join Modal
    function JoinModal(props) {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Join ${club?.name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{`Are you sure you want to join ${club?.name}?`}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleJoinClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleJoinClub}>
                        Join
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    // Leave Club Modal
    function LeaveModal(props) {
        return (
            <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
                <Modal.Header closeButton>
                    <Modal.Title>{`Leave ${club?.name}`}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{`Are you sure you want to leave ${club?.name}?`}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleLeaveClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleLeaveClub}>
                        Leave
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    

    return (
        
        <body className={styles.bookclub_container}>
            
            <div className={styles.bookclub_components}>
                
            <h1 >{club?.name}</h1>
            <h5>{`Created by ${club?.owner.first_name} ${club?.owner.last_name} on ${formatDate(club?.created_at)}`}</h5>
            
            <img src={club?.avatar_url ? club?.avatar_url : "/src_images/placeholder_bookclub_avatar.jpeg"} className={styles.bookclub_img}/>
            <p>{club?.description}</p>
            <div className={styles.bookclub_buttons}>
                <Button variant="primary" onClick={handleJoinShow}>Join</Button>
                <Button variant="primary" onClick={handleLeaveShow}>Leave</Button>
            </div>
            <div>
                {joinErrors && <p>{joinErrors}</p>}
                {leaveErrors && <p>{leaveErrors}</p>}
            </div>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/bookclubs/${club?.id}/members` }}>Members</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/bookclubs/${club?.id}/books` }}>
                    Books
                </Breadcrumb.Item>
                {club?.owner.id === loggedInUser?.id &&
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/bookclubs/${club?.id}/edit` }}>Edit</Breadcrumb.Item>}
            </Breadcrumb>
            <JoinModal show={joinModalShow} onHide={handleJoinClose} />
            <LeaveModal show={leaveModalShow} onHide={handleLeaveClose} />
            <div className="lists_container">
                <ClubContext.Provider value={club}>
                    <Routes>
                        <Route path="/bookclubs/:id/members" element={<ClubMembers />} />
                        {/* Other routes go here */}
                    </Routes>
                    <Outlet />
                </ClubContext.Provider>
                
                {/* <div className={styles.members_list}>
                    <h3>Members</h3>
                    <ul className={styles.users_lists}>
                        <NavLink to={`/userprofile/${club?.owner.id}`}>
                            <li key='owner'>
                                <LiaCrownSolid />
                                {club?.owner.first_name} {club?.owner.last_name}
                            </li>
                        </NavLink>
                        {club?.members.map((member, idx) => (
                        <NavLink to={`/userprofile/${member.id}`}>
                            <li key={idx}>
                                {member.first_name} {member.last_name}
                            </li>
                        </NavLink> 
                        ))}
                    </ul>
                </div> */}
            </div>
            </div>
        </body>
    )
}

export default ClubProfile