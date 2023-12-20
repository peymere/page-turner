import React from 'react'
import { useState, useEffect, useContext } from 'react'
import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap'
import { Modal } from 'react-bootstrap'
import { Dropdown } from 'react-bootstrap'

// local imports
import styles from '../stylesheets/Books.module.css'
import { OutletContext } from './App'

// Modal button functions
// Club Modal
function ClubModal({clubModalShow, handleClubClose, selectedClub, setSelectedClub, loggedInUser, handleAddBookToClub}) {
    
    return(
        <Modal
        show={clubModalShow} 
        onHide={handleClubClose}>
            <Modal.Header closeButton>
                <Modal.Title>Which book club do you want to add this book to?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <select
                    value={selectedClub ? selectedClub : ''}
                    onChange={(e) =>  setSelectedClub(e.target.value)}>
                        <option value='' disabled>Select a book club</option>
                    {loggedInUser && loggedInUser.book_clubs_owned.map((club) => (
                        <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                </select>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClubClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleAddBookToClub}>
                Add
            </Button>
            </Modal.Footer>
        </Modal>
    )
}
// Bookshelf Modal
function BookshelfModal({bookshelfModalShow, handleBookshelfClose, selectedShelfOption, setSelectedShelfOption, handleAddToBookShelf}) {
    return(
        <Modal
        show={bookshelfModalShow} 
        onHide={handleBookshelfClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add this book to your bookshelf</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <select 
                value={selectedShelfOption}
                onChange={(e) => setSelectedShelfOption(e.target.value)} >
                    <option value='' disabled>Select a bookshelf</option>
                    <option value='want to read' >Want to read</option>
                    <option value='reading' >Currently reading</option>
                    <option value='read' >Read</option>
                </select>
            </Modal.Body>
            <Modal.Footer>
                <Button 
                    variant="secondary"
                    onClick={handleBookshelfClose}
                >
                    Close
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleAddToBookShelf}
                    disabled={selectedShelfOption === ''} 
                >
                    Add
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

function Books() {
    const [books, setBooks] = useState([])
    const [selectedBook, setSelectedBook] = useState('')
    const { loggedInUser } = useContext(OutletContext)
    const [selectedClub, setSelectedClub] = useState('')
    const [selectedShelfOption, setSelectedShelfOption] = useState('')

    const [currentClub, setCurrentClub] = useState('')
    useEffect(() => {
        if (selectedClub) {
            const club = loggedInUser.book_clubs_owned.find((club) => club.id == selectedClub)
            setCurrentClub(club)
        }
    }, [selectedClub])

    // Modal States
    const [clubModalShow, setClubModalShow] = useState(false);
    const [bookshelfModalShow, setBookshelfModalShow] = useState(false);
    const handleClubClose = () => setClubModalShow(false);
    const handleBookshelfClose = () => setBookshelfModalShow(false);
    const handleClubOpen = () => setClubModalShow(true);
    const handleBookshelfOpen = () => setBookshelfModalShow(true);

    const handleAddToBookShelf = () => {
        if (!loggedInUser) {
            console.log('Please log in to add a book to your bookshelf')
        } else if (selectedShelfOption === '') {
            console.log('Please select a bookshelf to add a book to')
        } else {
            const bookAlreadyInShelf = loggedInUser.users_books.find((userBook) => userBook.book_id === selectedBook.id)
            if (bookAlreadyInShelf) {
                console.log(`${selectedBook.title} is already in ${loggedInUser.username}'s "${selectedShelfOption}" bookshelf`)
            } else {
                
                fetch('/usersbooks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        selectedBook:{
                            title: selectedBook.title,
                            author_name: selectedBook.author_name,
                            cover_i: selectedBook.cover_i,
                            first_publish_year: selectedBook.first_publish_year,
                            key: selectedBook.key
                        },
                        user_id: loggedInUser.id,
                        book_status: selectedShelfOption
                        }),
                    }).then((r) => {
                        if (r.ok) {
                            r.json().then((userBook) => {
                                console.log("Book added to user's bookshelf", userBook)
                            })
                        } else {
                            r.json().then((err) => {
                                console.log(err)
                            })
                        }})

                handleBookshelfClose()
                setSelectedShelfOption('')
                console.log(`Adding ${selectedBook.title} to ${loggedInUser.username}'s "${selectedShelfOption}" bookshelf`)

            }
        }
    }
    // console.log(book)
    const handleAddBookToClub = () => {
        console.log(selectedBook)
        if (selectedClub === '') {
            console.log('Please select a club to add a book to')
        } else {
            const bookAlreadyInClub = currentClub.book_clubs_books.find((b) => {
                return b.book_id === selectedBook.id
            })
            if (bookAlreadyInClub) {
                console.log(`${selectedBook.title} is already in ${currentClub.name}'s list of books`)
            } else {
                fetch('/bookclubsbooks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        selectedBook:{
                            title: selectedBook.title,
                            author_name: selectedBook.author_name,
                            cover_i: selectedBook.cover_i,
                            first_publish_year: selectedBook.first_publish_year,
                            key: selectedBook.key
                        },
                        book_club_id: currentClub.id
                        }),
                    }).then((r) => {
                        if (r.ok) {
                            r.json().then((bookClubBook) => {
                                console.log("Book added to book club", bookClubBook)
                            })
                        } else {
                            r.json().then((err) => {
                                console.log(err)
                            })
                        }})


                handleClubClose()
                setSelectedClub('')
                console.log(`Adding ${selectedBook.title} to ${currentClub.name}`)
                // post request to add book to book table
                //  post request to add book to book_club_books table
                // post request to add to members' users_books table
            }
        }
    }
    

    useEffect(() => {
        fetch('https://openlibrary.org/search.json?q=first_publish_year%3A[2020+TO+2023]&language%3Aeng&subject=fiction&limit=20&page=2&fields=title+author_name+cover_i+first_publish_year+key')
        .then((resp) => {
            if (resp.ok) {
                return resp.json()
            } else {
                console.log('error')
            }
            })
        .then((bookData) => {
            const updatedBooks = bookData.docs.map((book) => {
                const authorName = book.author_name && book.author_name.length > 0 ? book.author_name[0] : 'Unknown';
                return {...book, author_name: authorName}
            } )
            setBooks(updatedBooks)
        })
        .catch((err) => {
            console.log("Error getting books:", err);
        })
    }, [])

    
    console.log(selectedBook)
    

    return (
        <div className={styles.books_component}>
            <h1 className={styles.books_header}>Books</h1>
            <div className={styles.books_list} >
            <div className={styles.books_container}>
            {books.map((book, idx) => (
                <Card style={{ width: '14rem' }} key={idx} className={styles.book_card}>
                    <Card.Img 
                    className={styles.book_img}
                    variant="top" 
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} 
                    />
                    <Card.Body className={styles.book_card_body}>
                        <Card.Title className={styles.book_card_title}>{book.title}</Card.Title><div className={styles.publish_date}>{`(${book.first_publish_year})`}</div>
                        <Card.Text className={styles.book_card_author}>
                            {book.author_name}
                        </Card.Text>
                        {loggedInUser ? 
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Add Book
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {loggedInUser && <Dropdown.Item onClick={() => {
                                    handleBookshelfOpen();
                                    setSelectedBook(book)
                                }}>Add to Bookshelf</Dropdown.Item>}
                                {loggedInUser.book_clubs_owned && loggedInUser.book_clubs_owned.length > 0 && <Dropdown.Item onClick={() => {
                                    handleClubOpen();
                                    setSelectedBook(book)
                                }} >Add to Club</Dropdown.Item>}
                            </Dropdown.Menu>
                        </Dropdown>
                        : <div></div> }
                        <BookshelfModal 
                        bookshelfModalShow={bookshelfModalShow} handleBookshelfClose={handleBookshelfClose} selectedShelfOption={selectedShelfOption} setSelectedShelfOption={setSelectedShelfOption}
                        handleAddToBookShelf={handleAddToBookShelf}
                        />
                        <ClubModal 
                        clubModalShow={clubModalShow} 
                        handleClubClose={handleClubClose}
                        selectedClub={selectedClub}
                        setSelectedClub={setSelectedClub}
                        loggedInUser={loggedInUser}
                        handleAddBookToClub={handleAddBookToClub}
                        />
                    </Card.Body> 
                </Card>
                ))
            }
            </div>
            </div>
        </div>
    )
}

export default Books


/* {bookshelfModalShow, handleBookshelfClose, selectedShelfOption, setSelectedShelfOption, handleAddToBookShelf} */
/* {clubModalShow, handleClubClose, selectedClub, setSelectedClub, loggedInUser, handleAddBookToClub} */