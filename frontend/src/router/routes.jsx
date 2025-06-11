import Home from '../pages/Home';
import EventPage from '../pages/EventPage';
import Registration from '../pages/Registration';
import Login from '../pages/Login';
import ProfilePage from '../pages/ProfilePage';
import NotFound from '../pages/NotFound';
import ModerationPanel from '../pages/ModerationPanel';
import Layout from '../pages/layout/Layout';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/events/:id', element: <EventPage /> },
  { path: '/events/category/:slug', element: <Layout navIsVisible={true} /> },
  { path: '*', element: <NotFound /> },
];

export const publicRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/registration', element: <Registration /> },
];

export const privateRoutes = [
  { path: '/profile', element: <ProfilePage /> },
];

export const stuffRoutes = [
  { path: '/moderation', element: <ModerationPanel /> },
];