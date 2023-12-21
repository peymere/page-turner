import React from 'react';
import { NavLink } from 'react-router-dom';

// local imports
import styles from '../stylesheets/ExploreMore.module.css';

const ExploreMore = () => {
    return (
        <div className={styles.explore_more_container}>
            <div className={styles.container}>
                <ul>
                    <li>
                        <NavLink to='/bookclubs' className={`${styles.animated_arrow}`} href="https://google.com">
                            <span className={`${styles.the_arrow} ${styles.left}`}>
                                <span className={styles.shaft}></span>
                            </span>
                            <span className={styles.main}>
                                <span className={styles.text}>Explore More</span>
                                <span className={`${styles.the_arrow} ${styles.right}`}>
                                    <span className={styles.shaft}></span>
                                </span>
                            </span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default ExploreMore;