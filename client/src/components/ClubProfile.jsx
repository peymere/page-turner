import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate, NavLink } from "react-router-dom"
import { LiaCrownSolid } from "react-icons/lia";

// local imports
import { OutletContext } from './App'
import styles from '../stylesheets/ClubProfile.module.css'

function ClubProfile() {
    const { id } = useParams();
    const { loggedInUser, bookClubs } = useContext(OutletContext)
    const [club, setClub] = useState(null);

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
    console.log(club)

    return (
        <div className={styles.bookclub_container}>
            <div className={styles.bookclub_components}>
            <h1>{club?.name}</h1>
            <h5>{`Created by ${club?.owner.first_name} ${club?.owner.last_name} on ${formatDate(club?.created_at)}`}</h5>
            <img src={club?.avatar_url ? club?.avatar_url : "/src_images/placeholder_bookclub_avatar.jpeg"} className={styles.bookclub_img}/>
            <p>{club?.description}</p>
            <div className="lists_container">
                <div className={styles.members_list}>
                    <h3>Members</h3>
                    <ul className={styles.users_lists}>
                        <NavLink to={`/userprofile/${club?.owner.id}`}>
                            <li>
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
            </div>
            </div>
        </div>
    )
}

export default ClubProfile