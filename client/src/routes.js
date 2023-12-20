import App from './components/App';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import BookClubs from './components/BookClubs';
import Books from './components/Books';
import Bookshelf from './components/Bookshelf';
import ClubBooks from './components/ClubBooks';
import ClubProfile from './components/ClubProfile';
import ClubMembers from './components/ClubMembers';
import CreateBookClub from './components/CreateBookClub';
import ErrorPage from './components/ErrorPage';
import Login from './components/Login';
import MyBookClubs from './components/MyBookClubs';
import Search from './components/Search';
import Signup from './components/Signup';
import UserProfile from './components/UserProfile';
import EditBookClub from './components/EditBookClub';
import EditProfile from './components/EditProfile';

const routes = [
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <LandingPage />
            },
            {
                path: '/home',
                element: <HomePage />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/search',
                element: <Search />
            },
            {
                path: '/books',
                element: <Books />,
                
            },
            {
                path: '/bookclubs',
                element: <BookClubs />,
            },
            {
                path: '/bookclubs/:id/*',
                element: <ClubProfile />,
                children: [
                    {
                        path: 'members',
                        element: <ClubMembers />
                    },
                    {
                        path: 'books',
                        element: <ClubBooks />
                    },
                    {
                        path: 'edit',
                        element: <EditBookClub />
                    }
                ]
            },
            {
                path: '/create_book_club',
                element: <CreateBookClub />
            },
            {
                path: '/userprofile/:id/*',
                element: <UserProfile />,
                children: [
                    {
                        path: 'bookshelf',
                        element: <Bookshelf />
                    },
                    {
                        path: 'mybookclubs',
                        element: <MyBookClubs />
                    },
                    {
                        path: 'edit',
                        element: <EditProfile />
                    }
                ]
            }
        ]
    }
]

export default routes;