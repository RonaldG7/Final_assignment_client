import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import http from "../../plugins/http";

const AccountsComp = () => {

    const [otherUser, setOtherUser] = useState({})
    const [repliesCount, setRepliesCount] = useState(0)
    const [topicsCount, setTopicsCount] = useState(0)
    const {username} = useParams()

    useEffect(() => {
        (async function () {
            const getUser = await http.get("/getOtherUser/" + username)
            if (getUser.success) {
                setOtherUser(getUser.otherUser)
                setTopicsCount(getUser.topicsCount)
                setRepliesCount(getUser.repliesCount)
            }
        })()
    },[])

    return (
        <div className="app p-5">
            <div className="accHeader p-2 d-flex justify-content-around align-items-center">
                <div className="d-flex flex-column align-items-center">
                    <img className="accImg" src={otherUser?.image} alt=""/>
                </div>
                <h3>{otherUser?.username}</h3>
                <h3>Joined: {new Intl.DateTimeFormat('en-GB', {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }).format(otherUser?.joined)}</h3>
            </div>
            <div className="accBody d-flex justify-content-around p-3">
                <h4>Created topics: {topicsCount}</h4>
                <h4>Replies: {repliesCount}</h4>
            </div>
        </div>
    );
};

export default AccountsComp;