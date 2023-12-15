import App from './components/App';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import BookClubs from './components/BookClubs';
import BookProfile from './components/BookProfile';
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
                children: [
                    {
                        path: '/books/:id',
                        element: <BookProfile />
                    }
                ]
            },
            {
                path: '/bookclubs',
                element: <BookClubs />,
            },
            {
                path: '/bookclubs/:id',
                element: <ClubProfile />,
                children: [
                    {
                        path: '/bookclubs/:id/members',
                        element: <ClubMembers />
                    },
                    {
                        path: '/bookclubs/:id/books',
                        element: <ClubBooks />
                    }
                ]
            },
            {
                path: '/create_book_club',
                element: <CreateBookClub />
            },
            {
                path: '/userprofile/:id',
                element: <UserProfile />,
                children: [
                    {
                        path: '/userprofile/:id/bookshelf',
                        element: <Bookshelf />
                    },
                    {
                        path: '/userprofile/:id/mybookclubs',
                        element: <MyBookClubs />
                    }
                ]
            }
        ]
    }
]

export default routes;