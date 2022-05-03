import {useContext, useEffect, useRef, useState} from 'react';
import "./style.css"
import http from "../../plugins/http";
import {useNavigate, useParams} from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import mainContext from "../../context/mainContext";
import Pagination from "@mui/material/Pagination";
import CommentComp from "../commentComp/CommentComp";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000")

const TopicComp = () => {

    const {user} = useContext(mainContext)
    const [topic, setTopic] = useState({})
    const [status, setStatus] = useState(null)
    const [comments, setComments] = useState([])
    const [activePage, setActivePage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const {_id} = useParams()
    const nav = useNavigate()
    const commentRef = useRef()
    const urlRef = useRef()

    useEffect(() => {
        (async function () {
            const getTopic = await http.get("/getTopic/" + _id)
            if (getTopic.success) {
                setTopic(getTopic.findTopic)
            }
        })()
        socket.emit("join_topic", _id)
    }, [])

    function openUserPage() {
        if (topic.username === user.username) return nav("/account")
        nav("/accounts/" + topic.username)
    }

    const handleChange = (event, value) => {
        setActivePage(value);
    }

    useEffect(() => {
        openPage(activePage)
    }, [activePage])

    useEffect(() => {
        setActivePage(1)
        openPage(1)
    }, [])

    const openPage = (activePage) => {
        const data = {
            page: activePage,
            topicId: _id
        }
        http.post("/getComments", data).then(res => {
                if (res.success) {
                    setComments(res.comments)
                    setTotalPages(res.totalPages)
                }
            }
        )
    }

    async function sendRequest () {
        if (commentRef.current.value.length === 0) return setStatus('Comment field is empty')
        if (urlRef.current.value.length > 0 && !urlRef.current.value.startsWith('http')) return setStatus('Url has to start with http')

        const data = {
            page: activePage,
            topicId: _id,
            username: user.username,
            comment: commentRef.current.value,
            url: urlRef.current.value
        }
        const postComment = await http.post("/leaveComment", data)
        if (postComment.success) {
            setComments(postComment.comments)
            setTotalPages(postComment.totalPages)
            setActivePage(postComment.totalPages)
            setStatus(null)
            commentRef.current.value = ""
            urlRef.current.value = ""
        } else {
            setStatus(postComment.message)
        }
        await socket.emit("new_comment", data)
    }



    useEffect(() => {
        socket.on("update_topic", (data) => {
            setComments(data.comments)
            setTotalPages(data.totalPages)
            setActivePage(data.totalPages)
        })
    }, [socket])

    return (
        <div className="p-5 padding-sm">
            <div className="mb-5">
                <h3 className="ps-2">{topic.title}</h3>
                <div className="d-flex ps-1">
                    <p onClick={openUserPage} className="TPUser me-2"><PersonIcon className="TPUser"/> {topic.username}</p>
                    <p className="TPTime"><AccessTimeIcon className="TPTime"/> {new Intl.DateTimeFormat('en-GB', {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    }).format(topic.time)}</p>
                </div>
            </div>
            <div className="ps-1">
                <Pagination count={totalPages} page={activePage} onChange={handleChange} variant="outlined"
                            shape="rounded"
                            color="primary"/>
            </div>
            <div className="p-2">
                <CommentComp comment={topic}/>
            </div>
            <div className="p-2">
                {comments.map((comment, i) => <CommentComp key={comment._id} count={comment.count} comment={comment} />)}
            </div>
            {user && <div className="p-2">
                <div className="d-flex writeCommentBorder">
                    <div className="writeCommentLeftSide d-flex flex-column align-items-center p-2">
                        <img className="writeCommentLeftSideImg mb-2" src={user?.image} alt=""/>
                        <p className="writeCommentLeftSideUser">{user?.username}</p>
                    </div>
                    <div className="writeCommentRightSIdeCont w-100 p-2">
                        <TextField
                            className="w-100 mb-2"
                            inputRef={commentRef}
                            id="outlined-textarea-username"
                            label="What are your thoughts?"
                            placeholder="What are your thoughts?"
                            rows={3}
                            multiline
                        />
                        <TextField
                            className="w-100 mb-2"
                            inputRef={urlRef}
                            id="outlined-textarea-username"
                            label="You can add Image Url or YouTube Url here"
                            placeholder="Url"
                        />
                        <Button className="w-100 mb-2" variant="outlined" onClick={sendRequest}>Leave Comment</Button>
                        {status && <div className="d-flex justify-content-center status">
                            {status}
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default TopicComp;