import Home from '../pages/Home';
import EventPage from '../pages/EventPage';
import Registration from '../pages/Registration';
import Login from '../pages/Login';
import ProfilePage from '../pages/ProfilePage';
import NotFound from '../pages/NotFound';

export const routes = [
  { path: '/', element: <Home /> },
  { path: 'events/:id', element: <EventPage /> },
  { path: '*', element: <NotFound /> },
];

export const publicRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/registration', element: <Registration /> },
];

export const privateRoutes = [
  { path: '/profile', element: <ProfilePage /> },
];
