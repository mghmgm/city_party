import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes, privateRoutes, publicRoutes } from './router/routes';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './router/context';

function App() {
  const { isAuth } = useContext(AuthContext);

  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
          {isAuth
            ? privateRoutes.map((route) => <Route path={route.path} element={route.element} />)
            : publicRoutes.map((route) => <Route path={route.path} element={route.element} />)}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
