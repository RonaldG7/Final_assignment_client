import React, {useContext} from 'react';
import "./style.css"
import {useNavigate} from "react-router-dom"
import mainContext from "../../context/mainContext";
import http from "../../plugins/http";

const Toolbar = () => {

    const {user, setUser} = useContext(mainContext)
    const nav = useNavigate()

    function sendRequest () {
        http.get("/logout").then(res => {
            if (res.success) {
                localStorage.removeItem("stayLoggedIn")
                setUser(null)
                nav("/")
            }
        })
    }

    return (
        <div className="toolbar d-flex flex-column contBgdClr p-3">
            <div>
                <div onClick={() => nav("/")} className="toolbarHeader">
                    <h2>GermanCarForum</h2>
                    <p>An online community for new car enthusiasts</p>
                </div>
            </div>
            <div className="d-flex toolbarBgdClr">
                <div className="toolbarBtn p-1" onClick={() => nav("/")}>Forum</div>
                <div className="toolbarBtn p-1" onClick={() => nav("/rules")}>Rules</div>
                <div className="toolbarBtn p-1" onClick={() => nav("/favourites")}>Favourites</div>
                {user && <div className="toolbarBtn p-1" onClick={() => nav("/account")}>Account</div>}
                {!user && <div className="toolbarBtn p-1" onClick={() => nav("/register")}>Register</div>}
                {!user && <div className="toolbarBtn p-1" onClick={() => nav("/login")}>Login</div>}
                {user && <div className="toolbarBtn p-1" onClick={sendRequest}>Logout</div>}
            </div>
        </div>
    );
};

export default Toolbar;