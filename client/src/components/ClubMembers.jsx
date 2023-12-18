import { NavLink, useParams } from 'react-router-dom';
import { LiaCrownSolid } from "react-icons/lia";
import { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';

// local imports
import styles from '../stylesheets/ClubProfile.module.css';
import ClubContext from './ClubContext';

function ClubMembers() {
    const club = useContext(ClubContext);

    return (
        <div className={styles.members_component}>
        <h3 className={styles.members_header} >Members</h3>
        <div className={styles.members_list}>
            
            <div className={styles.member_card_container}>
                
                <Card style={{ width: '14rem' }} className={styles.member_card}>
                    <Card.Img 
                        variant="top" 
                        src={club?.owner.profile_pic ? club?.owner.profile_pic : "/src_images/placeholder-prof-pic.png"} 
                        alt="profile pic" 
                        className={styles.member_img}
                    />
                    <Card.Body className={styles.member_card_body}>
                        <Card.Title>
                            
                            <NavLink className={styles.member_link} to={`/userprofile/${club?.owner.id}`} >
                                <LiaCrownSolid  /> {' '}
                                @{club?.owner.username}
                            </NavLink>
                        </Card.Title>
                    </Card.Body>
                </Card>
                
                {club?.members.map((member, idx) => (
                    
                    <Card  className={styles.member_card}>
                        <Card.Img 
                        variant="top" 
                        src={member.profile_pic ? member.profile_pic : "/src_images/placeholder-prof-pic.png"} 
                        alt="profile pic"
                        className={styles.member_img}  
                        />
                        <Card.Body className={styles.member_card_body} >
                            <Card.Title className={styles.member_usernames}>
                            <NavLink to={`/userprofile/${member.id}`} className={styles.member_link}>
                                @{member.username}
                            </NavLink>
                            </Card.Title>
                        </Card.Body>
                    </Card>
                    
                ))}
                
            </div>
        </div>
        </div>
    );
}

export default ClubMembers;