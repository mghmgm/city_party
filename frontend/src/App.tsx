import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes, privateRoutes, publicRoutes } from './router/routes';
import { useAppDispatch, useAppSelector } from './store/store';
import { useEffect } from 'react';
import { getUser } from './store/AuthSlice';

function App() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.userProfile);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
          {user
            ? privateRoutes.map((route) => (
                <Route path={route.path} element={route.element} key={route.path} />
              ))
            : publicRoutes.map((route) => (
                <Route path={route.path} element={route.element} key={route.path} />
              ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
