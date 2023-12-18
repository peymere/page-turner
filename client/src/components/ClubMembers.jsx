import { NavLink, useParams } from 'react-router-dom';
import { LiaCrownSolid } from "react-icons/lia";
import { useContext } from 'react';
import Card from 'react-bootstrap/Card';

// local imports
import styles from '../stylesheets/ClubProfile.module.css';
import ClubContext from './ClubContext';

function ClubMembers() {
    const club = useContext(ClubContext);

    return (
        <div className={styles.members_list}>
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
        <Card style={{ width: '18rem' }}>
            <Card.Img 
                variant="top" 
                src={club?.owner.profile_pic ? club?.owner.profile_pic : "/src_images/placeholder-prof-pic.png"} 
                    alt="profile pic" 
            />
            <Card.Body>
                <Card.Title>
                    <LiaCrownSolid /> {' '}
                    @{club?.owner.username}
                </Card.Title>
                
            </Card.Body>
        </Card>
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                Some quick example text to build on the card title and make up the
                bulk of the card's content.
                </Card.Text>
            </Card.Body>
        </Card>
        </div>
    );
}

export default ClubMembers;