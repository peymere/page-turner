import React from "react";

function BookClubCard({ bookClub }) {
    // console.log('bookclub card:', bookClub)
    const name = bookClub.name
    const description = bookClub.description
    const avatar_url = bookClub.avatar_url
    const created_at = bookClub.created_at
    const owner = bookClub.owner


    return (
        <div>
            {/* <h1>Book Club Card</h1> */}
            <h2>{name}</h2>
            <img src={avatar_url} alt="book club avatar" />
            <p>{description}</p>
        </div>
    )
}

export default BookClubCard;