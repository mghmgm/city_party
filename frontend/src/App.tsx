import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes, privateRoutes, publicRoutes, stuffRoutes } from './router/routes';
import { useAppDispatch, useAppSelector } from './store/store';
import { useEffect } from 'react';
import { getUserProfile } from './store/AuthSlice';

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.userProfile);

  useEffect(() => {
    dispatch(getUserProfile());
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
          {user ? (
            user.is_superuser ? (
              // Для суперпользователя
              <>
                {privateRoutes.map((route) => (
                  <Route path={route.path} element={route.element} key={route.path} />
                ))}
                {stuffRoutes.map((route) => (
                  <Route path={route.path} element={route.element} key={route.path} />
                ))}
              </>
            ) : (
              // Для обычных пользователей
              privateRoutes.map((route) => (
                <Route path={route.path} element={route.element} key={route.path} />
              ))
            )
          ) : (
            // Для неавторизованных
            publicRoutes.map((route) => (
              <Route path={route.path} element={route.element} key={route.path} />
            ))
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
