import {useContext, useEffect, useRef, useState} from 'react';
import "./style.css"
import mainContext from "../../context/mainContext";
import http from "../../plugins/http";
import SingleTopic from "../singleTopic/SingleTopic";
import CommentComp from "../commentComp/CommentComp";
import NotificationsComp from "../notificationsComp/NotificationsComp";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const MyAccountComp = () => {

    const {user, setUser} = useContext(mainContext)
    const [show, setShow] = useState(1)
    const [myTopics, setMyTopics] = useState([])
    const [myComments, setMyComments] = useState([])
    const [showInput, setShowInput] = useState(false)
    const [status, setStatus] = useState(null)
    const [notifications, setNotifications] = useState([])
    const urlRef = useRef()

    async function getMyComments () {
        const comments = await http.get("/getMyComments")
        if (comments.success) setMyComments(comments.comments)
    }

    async function getNotifications () {
        const getNotifications = await http.get('/getNotifications')
        if (getNotifications.success) setNotifications(getNotifications.findNotifications)
    }

    useEffect(() => {
        (async function () {
            const myTopics = await http.get("/getMyTopics")
            if (myTopics.success) setMyTopics(myTopics.topics)
        })()
        getMyComments()
        getNotifications()
    }, [user])

    async function sendRequest() {
        if (!urlRef.current.value.includes("http")) return setStatus("Has to be an HTTP Url")
        const data = {
            url: urlRef.current.value
        }
        const changeImg = await http.post("/changeUserImg", data)
        if (changeImg.success) {
            setUser(changeImg.user)
            urlRef.current.value = ""
            setShowInput(false)
            setStatus(null)
        } else {
            setStatus(changeImg.message)
        }
    }

    return (
        <div className="app p-5 padding-sm">
            <div className="accHeader p-2 d-flex justify-content-around align-items-center">
                <div className="d-flex flex-column align-items-center">
                    <img className="accImg" src={user?.image} alt=""/>
                    <h5 onClick={() => setShowInput(!showInput)} className="accInputBtn">Click here to change profile
                        picture</h5>
                </div>
                <h3>{user?.username}</h3>
                <h3 className="dNone">Joined: {new Intl.DateTimeFormat('en-GB', {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }).format(user?.joined)}</h3>
            </div>
            <div className="accBody">
                {showInput && <div>
                    <div className="p-2 d-flex align-items-center">
                        <TextField
                            className="w-75 me-2"
                            inputRef={urlRef}
                            id="outlined-textarea-username"
                            label="HTTP Url"
                            placeholder="HTTP Url"
                            multiline
                        />
                        <Button className="w-25" variant="outlined" onClick={sendRequest}>Submit</Button>
                    </div>
                    {status && <p className="status p-2">{status}</p>}
                </div>}
                <div className="d-flex accBorder">
                    <div onClick={() => setShow(1)} className="accTopics w-50 d-flex justify-content-center p-2">
                        <h5>Topics</h5></div>
                    <div onClick={() => setShow(2)} className="accComments w-50 d-flex justify-content-center p-2">
                        <h5>Comments</h5></div>
                    <div onClick={() => setShow(3)} className="accComments w-50 d-flex justify-content-center p-2">
                        <h5>Notifications ({notifications.length})</h5></div>
                </div>
                {show === 1 &&
                    <div>
                        {myTopics.length > 0 ? myTopics.map((x, i) => <SingleTopic topic={x} key={i}/>).reverse()
                            :
                            <div className="d-flex justify-content-center p-2"><h5>No topics</h5></div>}
                    </div>}
                {show === 2 &&
                    <div>
                        {myComments.length > 0 ? myComments.map((x, i) => <CommentComp comment={x} count={x.count} key={x._id}/>).reverse()
                            :
                            <div className="d-flex justify-content-center p-2"><h5>No comments</h5></div>}
                    </div>}
                {show === 3 &&
                    <div>
                        {notifications.length > 0 ? notifications.map((x, i) => <NotificationsComp topic={x} key={i}/>).reverse()
                        :
                            <div className="d-flex justify-content-center p-2"><h5>No notifications</h5></div>}
                    </div>}
            </div>
        </div>
    );
};

export default MyAccountComp;