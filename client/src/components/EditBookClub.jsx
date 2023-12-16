import { useContext, useState } from 'react';

// local imports
import ClubContext from './ClubContext';
import { OutletContext } from './App';


function EditBookClub() {
    const club = useContext(ClubContext);
    const { loggedInUser } = useContext(OutletContext)

    return (
        <div>
            <h3>Edit Book Club</h3>
        </div>
    )
}

export default EditBookClub