import Home from "../pages/Home"
import Registration from "../components/Registration"
import Login from "../components/Login"

export const routes = [
  {path: '/', element: <Home />},
  { path: '/login', element: <Login /> },
  { path: '/registration', element: <Registration /> },
]