import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes, privateRoutes, publicRoutes } from './router/routes';
import { useContext } from 'react';
import { AuthContext } from './router/context';

function App() {
  const { isAuth } = useContext(AuthContext);

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} key={route.path} />
          ))}
          {isAuth
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
