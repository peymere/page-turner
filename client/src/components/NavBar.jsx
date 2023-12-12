import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

// local imports
import styles from '../stylesheets/NavBar.module.css'


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
        <div className='custom_navbar'>
            <Navbar expand="lg" className='position-fixed w-100' style={
                {"backgroundColor": "#F3EDD2"}
            }>
                <Container>
                    <Navbar.Brand href="#home" className="pt_logo">
                        <img
                        alt="PageTurner Logo"
                        src="/reading-book-logo.png"
                        width="30"
                        height="30"
                        // className="d-inline-block align-top"
                        />{' '}
                        PageTurner
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end align-items-right">
                    <Nav className="me-1 navbar_nav">
                        <Nav.Link href="/home" className='navbar_text'>Home</Nav.Link> <p className='nav_divider'>|</p>
                        <Nav.Link href="/search" className='navbar_text'>Discover</Nav.Link> <p className='nav_divider'>|</p>
                        {!user ? (
                        <>
                            <Nav.Link href='/login' className='navbar_text'>Login</Nav.Link> 
                            <p className='nav_divider'>|</p>
                        </> ) : (
                        <>
                            <Nav.Link href={`/userprofile/${user.id}`} className='navbar_text'>Dashboard</Nav.Link>
                            <p className='nav_divider'>|</p>
                        </>
                        )}
                        {!user ? (
                        <>
                            <Nav.Link href='/signup' className='navbar_text'>Sign Up</Nav.Link>
                            <p className='nav_divider'>|</p> 
                        </> ) : (
                        <>
                            <Nav.Link onClick={handleLogout} className='navbar_text'>Logout</Nav.Link>
                            <p className='nav_divider'>|</p>
                        </> )
                        }
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavBar