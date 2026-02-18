import {
    createBrowserRouter,
} from "react-router-dom";
import HomePage from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Site from "../pages/Site/Site";
import App from "../App";

const router = createBrowserRouter([
    {
        element: <App />,
        children: [
            { path: "/", element: <Site /> },
            { path: "/home", element: <HomePage /> },
            { path: "/login", element: <Login /> },
        ],
    },
]);
export default router;
