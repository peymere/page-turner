import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { NavLink } from 'react-router-dom';


function NavBar({setUser}) {
    

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
            <h1>NavBar</h1>
            <ButtonGroup aria-label="Basic example">
                <Button variant="secondary"><NavLink to='/login' className="nav-link">Login</NavLink></Button>
                <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                <Button variant="secondary"><NavLink to='/signup' className="nav-link">Sign Up</NavLink></Button>
            </ButtonGroup>

        </div>
    )
}

export default NavBar