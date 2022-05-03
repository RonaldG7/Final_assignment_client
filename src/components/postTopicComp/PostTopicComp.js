import {useContext, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import "./style.css"
import http from "../../plugins/http";
import mainContext from "../../context/mainContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const PostTopicComp = () => {

    const {user} = useContext(mainContext)
    const [status, setStatus] = useState(null)
    const titleRef = useRef()
    const commentRef = useRef()
    const urlRef = useRef()
    const nav = useNavigate()

    async function sendRequest () {
        if (user.username.length === 0) return setStatus("You have to log in")
        if (titleRef.current.value.length === 0) return setStatus('Title field is empty')
        if (titleRef.current.value.length < 4) return setStatus('Title is too short. 4 symbols min.')
        if (titleRef.current.value.length > 50) return setStatus('Title is too long. 50 symbols max.')
        if (commentRef.current.value.length === 0) return setStatus('Description field is empty')
        if (urlRef.current.value.length > 0 && !urlRef.current.value.startsWith('http')) return setStatus('Url has to start with http')

        const data = {
            username: user.username,
            title: titleRef.current.value,
            comment: commentRef.current.value,
            url: urlRef.current.value
        }
        const postTopic = await http.post("/postTopic", data)
        if (postTopic.success) {
            nav("/account")
            setStatus(null)
        } else {
            setStatus(postTopic.message)
        }
    }

    return (
        <div className="app p-5">
            <div className="postHeader p-2">
                Post Topic
            </div>
            <div className="postBody p-2">
                <TextField
                    className="w-100 mb-2"
                    inputRef={titleRef}
                    id="outlined-textarea-username"
                    label="Title"
                    placeholder="Title"
                />
                <TextField
                    className="w-100 mb-2"
                    inputRef={commentRef}
                    id="outlined-textarea-username"
                    label="Description"
                    placeholder="Description"
                    rows={5}
                    multiline
                />
                <TextField
                    className="w-100 mb-2"
                    inputRef={urlRef}
                    id="outlined-textarea-username"
                    label="You can add Image Url or YouTube Url here"
                    placeholder="Url"
                />
                <div className="d-flex justify-content-end">
                    <Button className="w-100 mb-2" variant="outlined" onClick={sendRequest}>Create Topic</Button>
                </div>
                {status && <div className="d-flex justify-content-center status">
                   {status}
                </div>}
            </div>
        </div>
    );
};

export default PostTopicComp;