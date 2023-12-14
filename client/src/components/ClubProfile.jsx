import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"

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

    return (
        <div className={styles.bookclub_container}>
            <h1>{club?.name}</h1>
            <h5>{`Created by ${club?.owner.first_name} ${club?.owner.last_name} on ${formatDate(club?.created_at)}`}</h5>
            <img src={club?.avatar_url ? club?.avatar_url : "/src_images/placeholder_bookclub_avatar.jpeg"} className={styles.bookclub_img}/>
            <p>{club?.description}</p>
            

        </div>
    )
}

export default ClubProfile