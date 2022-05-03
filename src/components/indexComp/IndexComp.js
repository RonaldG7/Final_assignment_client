import {useEffect, useContext, useState} from 'react';
import "./style.css";
import mainContext from "../../context/mainContext";
import http from "../../plugins/http";
import Pagination from '@mui/material/Pagination';
import SingleTopic from "../singleTopic/SingleTopic";
import CreateIcon from '@mui/icons-material/Create';
import {useNavigate} from "react-router-dom";

const IndexComp = () => {

        const {user} = useContext(mainContext)
        const [topics, setTopics] = useState([])
        const [totalPages, setTotalPages] = useState(1)
        const [activePage, setActivePage] = useState(1)

        const nav = useNavigate()

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
            const sendData = {
                page: activePage
            }
            http.post("/getTopics", sendData).then(res => {
                    if (res.success) {
                        setTopics(res.topics)
                        setTotalPages(res.totalPages)
                    }
                }
            )
        }

        return (
            <div className="app p-5 padding-sm">
                <div className="d-flex align-items-center justify-content-between">
                    <Pagination className="p-2" count={totalPages} page={activePage} onChange={handleChange}
                                variant="outlined"
                                shape="rounded"
                                color="primary"/>
                    {user && <div onClick={() => nav("/postTopic")} className="postTopicBtn d-flex align-items-center p-1">
                        <CreateIcon/> Post Topic
                    </div>}
                </div>
                <div>
                    <div className="indexHeader p-2">
                        Main
                    </div>
                    <div className="indexBody">
                        {topics.map((topic, i) => <SingleTopic activePage={activePage} topic={topic} key={topic._id}/>)}
                    </div>
                </div>
            </div>
        );
    }
;

export default IndexComp;