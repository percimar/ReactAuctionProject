
import React, { useContext, useEffect, useState } from "react";
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import Info from "../components/Typography/Info.js";
import Primary from "../components/Typography/Primary.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'
import db from '../db'
import AuctionDetails from '../Carlos/AuctionDetails'

const useStyles = makeStyles(styles);

export default function Comment({ auctionId, itemId, id, comment, timestamp, userId }) {

    const classes = useStyles();

    const { user } = useContext(UserContext)

    const [commenter, setCommenter] = useState();
    useEffect(() => {
        const getData = async () => {
            setCommenter(await db.Users.findOne(userId))
            console.log(commenter)
        }
        getData()
    }, [])

    const [replies, setReplies] = useState([]);
    useEffect(() => db.Auctions.Items.Comments.Replies.listenToOneCommentAllReplies(setReplies, auctionId, itemId, id))

    return (
        <div>
            <hr />
            <p>
                <small> <b>{commenter ? commenter.name : ""}</b> asked on {timestamp.toDateString()}</small>
                <br />
                {comment}
            </p>
            {replies.map(reply => <div key={reply.id}>
                <p>
                    <small><b>Seller</b> replied on {reply.timestamp.toDateString()}</small>
                    <br />
                    {reply.reply}
                </p>
            </div>)}

        </div>
    )
}