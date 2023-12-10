import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { NavLink } from 'react-router-dom';


function NavBar({user, setUser}) {
    

    function handleLogout() {
        fetch('/logout', {
            method: 'DELETE'
        }).then((r) => {
            if (r.ok) {
                setUser(null)
                console.log('logged out')
                //navigate to landing page
            }
        })
    }

    return (
        <div>
            <Button><NavLink to='/home' className="nav-link">Home</NavLink></Button>
            <ButtonGroup aria-label="Basic example">
                {!user ? <Button variant="secondary"><NavLink to='/login' className="nav-link">Login</NavLink></Button> : 
                <Button variant="secondary"><NavLink to={`/userprofile/${user.id}`} className="nav-link">Profile</NavLink></Button>}
                {!user ? <Button variant="secondary"><NavLink to='/signup' className="nav-link">Sign Up</NavLink></Button> : <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                }
                
                
                
            </ButtonGroup>

        </div>
    )
}

export default NavBar