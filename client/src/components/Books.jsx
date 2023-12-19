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
        <div className={styles.book_component}>
        {books.map((book, idx) => (
            
                <div key={idx}>
                    <h1>{book.title}</h1>
                    <h2>{book.author_name[0]}</h2>
                    <img src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`} alt="book cover" />
                </div>
        )

        
        )}
        </div>
    )
}

export default Books