import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

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
                    console.log(user);
                    setUser(user);
                })
                .catch((err) => {
                    console.log("Error getting user data:", err);
                });
        }
    }, [id]);

    function formatDate(dateString) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    return (
        <div>
            {user ? (
                <div>
                    <h2>{`${user['first_name']}'s Profile`}</h2>
                    <h3>@{user.username}</h3>
                    <h6>Member since {formatDate(user.created_at)}</h6>
                </div>
            ) : (
                <h1>User not found</h1>
            )}
        </div>
    );
};

export default UserProfile;
