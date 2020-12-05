
import React, { useContext, useEffect, useState } from "react";
import GridItem from "../components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'
import db from '../db'
import Parallax from "../components/Parallax/Parallax.js";
import GridContainer from "../components/Grid/GridContainer.js";
import FollowingItem from './FollowingItem'
import image from "../assets/img/bg8.jpg";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(styles);

export default function Following() {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const { user } = useContext(UserContext)

    const [following, setFollowing] = useState([])
    useEffect(() => db.Users.Following.listenToOneUserAllFollowing(setFollowing, user.id), [user])
    return (
        <>
            <Parallax filter image={image}>
                <div className={classes.container}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                            <h1 className={classes.title}>Following List</h1>
                        </GridItem>
                    </GridContainer>
                </div>
            </Parallax>
            <GridContainer>
                {
                    following.length != 0 ?
                        following.map(oneFollow =>
                            <FollowingItem key={oneFollow.auctionId} id={oneFollow.auctionId} />)
                        :
                            <h1>No following list</h1>
                }
            </GridContainer>
        </>
    )
}