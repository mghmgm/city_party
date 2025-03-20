import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './router/routes';

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
