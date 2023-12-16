import { NavLink, useParams } from 'react-router-dom';
import { LiaCrownSolid } from "react-icons/lia";
import { useContext } from 'react';

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
        </div>
    );
}

export default ClubMembers;