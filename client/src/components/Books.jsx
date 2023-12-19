import React from 'react'
import { useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import { NavLink } from 'react-router-dom'

// local imports
import styles from '../stylesheets/Books.module.css'

function Books() {
    const [books, setBooks] = useState([])

    useEffect(() => {
        fetch('https://openlibrary.org/search.json?q=first_publish_year%3A[2020+TO+2023]&language%3Aeng&subject=fiction&limit=20&page=2&fields=title+author_name+cover_i')
        .then((resp) => {
            if (resp.ok) {
                return resp.json()
            } else {
                console.log('error')
            }
            })
        .then((bookData) => {
            setBooks(bookData.docs)
        })
        .catch((err) => {
            console.log("Error getting books:", err);
        })
    }, [])

    // console.log('Books:', books)

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
                        <Card.Title className={styles.book_card_title}>{book.title}</Card.Title>
                        <Card.Text className={styles.book_card_author}>
                            {book.author_name[0]}
                        </Card.Text>
                        {/* <NavLink to={`/books/${book.key.slice(7)}`} className={styles.book_link}>See More</NavLink> */}
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