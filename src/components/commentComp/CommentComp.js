import {useEffect, useState} from 'react';
import "./style.css"
import http from "../../plugins/http";

const CommentComp = ({comment, count}) => {

    const [userImg, setUserImg] = useState("")
    const [youtubeUrl, setYoutubeUrl] = useState("")
    const [link, setLink] = useState("")

    useEffect(() => {
        (async function () {
            const userImg = await http.get("/getUserImg/" + comment.username)
            if (userImg.success) {
                setUserImg(userImg.userImg)

            }
        })()
        if (comment.url?.includes("youtube")) {
            const embedded = comment.url.split("v=")[1].split("&")[0]
            setYoutubeUrl(embedded)
        } else if (comment.url?.includes("youtu.be")) {
            const embedded = comment.url.split("/")
            const embedded2 = embedded[embedded.length - 1]
            setYoutubeUrl(embedded2)
        } else {
            setLink(comment.url)
        }
    }, [comment])


    return (
        <div className="d-flex commentBorder mb-2 columnSm">
            <div className="commentLeftSide d-flex flex-column align-items-center p-2 dFlexRowSm w100">
                <img className="commentLeftSideImg mb-2 ImgSm" src={userImg} alt=""/>
                <p className="commentLeftSideUser">{comment.username}</p>
            </div>
            <div className="commentRightSIdeCont w-100 p-2">
                <div className="commentRightSideContTop d-flex justify-content-between">
                    <p className="commentRightSIdeTime"> {new Intl.DateTimeFormat('en-GB', {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric"
                    }).format(comment.time)}</p>
                    <p className="commentRightSideNumber">#{comment.title ? 1 : ""}{count ? count : ""}</p>
                </div>
                <div>
                    <p className="p-3">
                        {comment.comment?.split('\n').map((item, key) => {
                            return <span className="wordWrap" key={key}>{item}<br/></span>
                        })}
                    </p>
                    <div className="p-3">
                        {youtubeUrl !== "" &&
                            <iframe className="YTPlayer YTPlayerSM" src={`https://www.youtube.com/embed/${youtubeUrl}`}
                                    title="YouTube video player" frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen></iframe>}

                        {link !== "" && <img className="urlImg URLImgSM" src={link} alt=""/>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentComp;