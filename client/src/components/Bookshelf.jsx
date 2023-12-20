import Carousel from 'react-bootstrap/Carousel';
import { useState, useEffect, useContext } from 'react';

// local imports
import styles from '../stylesheets/Bookshelf.module.css';
import UserContext from './Contexts/UserContext';
import { OutletContext } from './App';

function Bookshelf() {
    const { loggedInUser, bookClubs } = useContext(OutletContext)
    const {users_books, user} = useContext(UserContext);
    console.log(users_books)

    const reading_books_list = users_books?.filter((book) => book.book_status === "reading")
    const reading_books = reading_books_list?.map((book) => book.book)
    const read_books_list = users_books?.filter((book) => book.book_status === "read")
    const read_books = read_books_list?.map((book) => book.book)
    const to_read_books_list = users_books?.filter((book) => book.book_status === "want to read")
    const to_read_books = to_read_books_list?.map((book) => book.book)

    console.log('reading_books', reading_books)
    console.log('read_books', read_books)
    console.log('to_read_books', to_read_books)
    return (
        <div className={styles.bookshelf_container}>
            <h1 className={styles.bookshelf_header}>{
                loggedInUser?.id === user?.id ? "My Bookshelf" : `${user?.username}'s Bookshelf`
            }</h1>
            <div className={styles.carousels_container}>
                <div className={styles.to_read_carousel_cont}>
                    <h3 className={styles.to_read_header}>Want to Read:</h3>
                    <Carousel className={styles.carousel}>
                    {to_read_books?.map((book) => (
                        <Carousel.Item className={styles.item}>
                            <img
                            className={styles.book_img}
                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                            alt="First slide"
                            />
                            <Carousel.Caption className='visually-hidden' >
                                <h3>{book.title}</h3>
                                <p>{book.author_name}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                    </Carousel>  
                </div>
                <div className={styles.reading_container}>
                    <h3 className={styles.reading_header}>Currently Reading:</h3>
                    <Carousel className={styles.carousel}>
                    {reading_books?.map((book) => (
                        <Carousel.Item className={styles.item}>
                            <img
                            className={styles.book_img}
                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                            alt="First slide"
                            />
                            <Carousel.Caption className='visually-hidden'>
                                <h3>{book.title}</h3>
                                <p>{book.author_name}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                    </Carousel>
                </div>
                <div className={styles.read_container}>
                    <h3 className={styles.read_header}>Read:</h3>
                    <Carousel className={styles.carousel}>
                    {read_books?.map((book) => (
                        <Carousel.Item className={styles.item}>
                            <img
                            className={styles.book_img}
                            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                            alt="First slide"
                            />
                            <Carousel.Caption className='visually-hidden'>
                                <h3>{book.title}</h3>
                                <p>{book.author_name}</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
}



export default Bookshelf