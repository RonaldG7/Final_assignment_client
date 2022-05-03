import {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./style.css"
import http from "../../plugins/http";
import mainContext from "../../context/mainContext";

const SingleTopic = ({topic, activePage}) => {

    const {user, getFavorites, setFavoritesIds} = useContext(mainContext)
    const [getWatching, setWatching] = useState(false)
    const [userImg, setUserImg] = useState("")
    const [replies, setReplies] = useState(0)
    const [lastComment, setLastComment] = useState(null)
    const nav = useNavigate()

    async function getReplies () {
        const replies = await http.get("/getReplies/" + topic._id)
        if (replies.success) {
            setReplies(replies.count)
            setLastComment(replies.lastComment)
        }
    }

    useEffect(() => {
        (async function () {
            const userImg = await http.get("/getUserImg/" + topic.username)
            if (userImg.success) {
                setUserImg(userImg.userImg)
            }
        })()
        getReplies()
    }, [activePage, user])

    function openUserPage () {
        if (topic.username === user?.username) return nav("/account")
        nav("/accounts/" + topic.username)
    }

    function openOtherUserPage () {
        if (user?.username === lastComment?.username) return nav("/account")
        nav("/accounts/" + lastComment?.username)
    }

    function funcLastComment() {
        if (lastComment !== undefined) {
            return new Intl.DateTimeFormat('lt-Lt', {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
            }).format(lastComment?.time)
        }
    }

    useEffect(() => {
        const values = JSON.parse(localStorage.getItem('favorites'))
        if (values && values.includes(topic._id)) {
            return setWatching(true)
        } else {
            return setWatching(false)
        }
    }, [getFavorites])

    function addToFavorites() {
        const values = JSON.parse(localStorage.getItem('favorites'))
        if (values.includes(topic._id)) {
            const index = values.indexOf(topic._id)
            values.splice(index, 1)
        } else {
            values.push(topic._id)
        }
        localStorage.setItem('favorites', JSON.stringify(values));
        setFavoritesIds(values)
        setWatching(!getWatching)
    }

    return (
        <div className="d-flex STCBorder">
            <div className="d-flex w-50 p-2">
                <img onClick={openUserPage} className="STUserImg me-2" src={userImg} alt=""/>
                <div>
                    <div className="d-flex">
                        <h5 onClick={() => nav("/topic/" + topic._id)} className="STTopicTitle me-2">{topic.title} </h5>
                        <div className="favoriteSymbol" onClick={addToFavorites}
                             style={{color: getWatching ? 'red' : 'lightgray'}}><h5>♥</h5>
                        </div>
                    </div>

                    <div className="d-flex">
                        <p onClick={openUserPage} className="STTopicUsername me-2">by {topic.username}</p>
                        <p onClick={() => nav("/topic/" + topic._id)} className="STTopicTime">
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
            <div className="w-25 d-flex align-items-center w50 mr10 flex-end">
                <p className="STReplies STRepliesMargin me-1">Replies:</p>
                <p className="STRepliesMargin">{replies}</p>
            </div>
            <div className="w-25 d-flex flex-column align-items-end justify-content-center me-4 dNone">
                <p onClick={() => nav("/topic/" + topic._id)} className="STCommentTime">{funcLastComment()}</p>
                <p onClick={openOtherUserPage} className="STCommentUser">{lastComment !== undefined ? "Commented by: " + lastComment?.username : "No comments left"}</p>
            </div>
        </div>
    );
};

export default SingleTopic;