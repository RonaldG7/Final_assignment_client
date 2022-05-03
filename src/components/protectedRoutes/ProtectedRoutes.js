import {Navigate, Outlet} from "react-router-dom";
import {useContext} from "react";
import mainContext from "../../context/mainContext";

const ProtectedRoutes = () => {
    const {user} = useContext(mainContext)

    return user || localStorage.getItem("stayLoggedIn") === "true" ? <Outlet/> : <Navigate to="/"/>;
};

export default ProtectedRoutes;