import Home from '../pages/Home';
import EventPage from '../pages/EventPage';
import Registration from '../components/Registration';
import Login from '../components/Login';
import ProfilePage from '../pages/ProfilePage';

const isAuthenticated = !!localStorage.getItem('auth_token');

export const routes = [
  { path: '/', element: <Home /> },
  ...(isAuthenticated ? [
    { path: '/profile', element: <ProfilePage /> },
  ] : [
    { path: '/login', element: <Login /> },
    { path: '/registration', element: <Registration /> },
  ]),
  { path: '/:id', element: <EventPage /> },
];
