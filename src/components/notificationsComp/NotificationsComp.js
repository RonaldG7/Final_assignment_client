import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./style.css"
import http from "../../plugins/http";
import mainContext from "../../context/mainContext";

const NotificationsComp = ({topic}) => {

    const {user} = useContext(mainContext)
    const [userImg, setUserImg] = useState("")
    const nav = useNavigate()

    useEffect(() => {
        (async function () {
            const userImg = await http.get("/getUserImg/" + topic.username)
            if (userImg.success) {
                setUserImg(userImg.userImg)
            }
        })()
    }, [user])

    function openUserPage() {
        nav("/accounts/" + topic.commentLeftBy)
    }

    return (
        <div className="d-flex STCBorder">
            <div className="d-flex w-50 p-2 justify-content-between align-items-center w100">
                <img className="STUserImg me-2" src={userImg} alt=""/>
                <div className="d-flex">
                    <h5 onClick={() => nav("/topic/" + topic.topicId)} className="STTopicTitle me-2">{topic.title}</h5>
                </div>
                <div className="d-flex">
                    <p onClick={openUserPage} className="STTopicUsername me-2">Comment left by {topic.commentLeftBy}</p>
                    <p className="STTopicTime">
                        {new Intl.DateTimeFormat('en-GB', {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric"
                        }).format(topic.time)}</p>
                </div>
            </div>
        </div>
    );
};

export default NotificationsComp;