import { useEffect, useState, useContext } from "react"

// local imports
import { OutletContext } from './App'
import BookClubCard from './BookClubCard'

function BookClubs() {
    const { bookClubs } = useContext(OutletContext)
    console.log(bookClubs)
    const clubsToRender = bookClubs || [];

    return (
        <div>
            <h1>Book Clubs</h1>
            {clubsToRender.map((bookClub) => (
                <BookClubCard key={bookClub.id} bookClub={bookClub} />
            ))}
        </div>
    );
}

export default BookClubs