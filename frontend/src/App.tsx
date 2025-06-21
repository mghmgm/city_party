import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/store';
import { getUserProfile } from './store/AuthSlice';
import { routes, privateRoutes, publicRoutes, stuffRoutes } from './router/routes';

function App() {
  const dispatch = useAppDispatch();
  const { userProfile, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !userProfile) {
      dispatch(getUserProfile());
    }
  }, [dispatch, userProfile]);

  const isSuperuser = userProfile?.is_superuser || false;

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        
        {isAuthenticated ? (
          <>
            {privateRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
            {isSuperuser && stuffRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </>
        ) : (
          publicRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;