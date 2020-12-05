
import React, { useContext, useEffect, useState } from "react";
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import SendIcon from '@material-ui/icons/Send';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from "@material-ui/core/IconButton";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'
import db from '../db'

const useStyles = makeStyles(styles);

export default function Review({ userId, reviewId, rating, review, timestamp, buyerUserId }) {

    const classes = useStyles();

    const { user } = useContext(UserContext)

    const [reviewer, setReviewer] = useState();
    useEffect(() => {
        const getData = async () => {
            setReviewer(await db.Users.findOne(buyerUserId))
        }
        getData()
    }, [])


    return (
        <div>
            <hr />
            <p>
                <small> <b>{reviewer ? reviewer.name : ""}</b> gave this user a thumbs {rating ? "up!" : "down!"}</small>
                {/*rating ? <ThumbUpIcon fontSize="small" color="primary" /> : <ThumbDownIcon fontSize="small" color="error" />*/}
                <br />
                {review}
                <small justify="right">{timestamp.toDateString()}</small> &nbsp;
            </p>
        </div>
    )
}