
import React, { useContext, useEffect, useState } from "react";
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'
import db from '../db'

const useStyles = makeStyles(styles);

export default function Comment({ auctionId, itemId, sellerUserId, id, comment, timestamp, userId }) {

    const classes = useStyles();

    const { user } = useContext(UserContext)

    const [commenter, setCommenter] = useState();
    useEffect(() => {
        const getData = async () => {
            setCommenter(await db.Users.findOne(userId))
        }
        getData()
    }, [])

    const [replies, setReplies] = useState([]);
    useEffect(() => db.Auctions.Items.Comments.Replies.listenToOneCommentAllReplies(setReplies, auctionId, itemId, id))

    const [replyText, setReplyText] = useState("");
    const addReply = () => {
        if (replyText) {
            db.Auctions.Items.Comments.Replies.addReply(auctionId, itemId, id, { reply: replyText, timestamp: new Date() })
            db.Users.Notifications.sendNotification(userId,
                {
                    title: `A seller replied to your question!`,
                    description: `They said ${replyText}`,
                    link: `/auctions/items/${auctionId}`
                });
            setReplyText("");
        }
    }

    const deleteComment = () => {
        db.Auctions.Items.Comments.removeComment(auctionId, itemId, id)
    }

    const deleteReply = (replyId) => {
        db.Auctions.Items.Comments.Replies.removeReply(auctionId, itemId, id, replyId)
    }

    return (
        <div>
            <hr />
            <p>
                <small> <b>{commenter ? commenter.name : ""}</b> asked on {timestamp.toDateString()}</small>
                <br />
                {comment}
                {user?.id === commenter?.id
                    &&
                    <IconButton size="small" color="primary" onClick={deleteComment}>
                        <ClearIcon fontSize="small" />
                    </IconButton>}
            </p>
            {replies.map(reply =>
                <div key={reply.id}>
                    <p>
                        <small><b>Seller</b> replied on {reply.timestamp.toDateString()}</small>
                        <br />
                        {reply.reply}
                        {user?.id === sellerUserId
                            &&
                            <IconButton size="small" color="primary" onClick={() => deleteReply(reply.id)}>
                                <ClearIcon fontSize="small" />
                            </IconButton>}
                    </p>
                </div>)}
            {
                user?.id === sellerUserId &&
                <TextField
                    label="Reply"
                    value={replyText}
                    onChange={(event) => setReplyText(event.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment>
                                <IconButton size="small" color="primary" onClick={addReply}>
                                    <SendIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            }
        </div>
    )
}