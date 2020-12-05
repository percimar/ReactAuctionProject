import React, { useContext, useEffect, useState } from "react";
import db from '../db'
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "../components/Footer/Footer.js";
import Grid from '@material-ui/core/Grid'
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Parallax from "../components/Parallax/Parallax.js";
import styles from "../assets/jss/material-kit-react/views/landingPage";
import sectionStyles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle";
import Auctions from "./Auctions.js";
import image from "../assets/img/bg8.jpg";
import UserContext from '../UserContext'


import Carousel from "react-slick";
import LocationOn from "@material-ui/icons/LocationOn";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Notification from './Notification'
import Button from '@material-ui/core/Button'
import image1 from "assets/img/bg8.jpg";
import image2 from "assets/img/bg8.jpg";
import image3 from "assets/img/bg8.jpg";
import { useHistory, Link } from "react-router-dom";
const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true
};

const useStyles = makeStyles(styles);
const useSecStyles = makeStyles(sectionStyles)

export default function Notifications() {

    const { user } = useContext(UserContext)
    const history = useHistory()
    const classes = useStyles();
    const secClasses = useSecStyles();

    const [notifications, setNotifications] = useState([])
    useEffect(() => db.Users.Notifications.listenToNotifications(setNotifications, user.id), [])

    const [count, setNotifCount] = useState([])
    useEffect(() => db.Users.Notifications.listenToUnseenNotificationsCount(setNotifCount, user.id), [])

    const [color, setColor] = useState(false)

    const mouseHover = (notif) => {
        if(!notif.viewed){
            db.Users.Notifications.markSeen(user.id, notif)
        }
        setColor(true)
    }

    const clear = (id) => {
        db.Users.Notifications.clearNotification(user.id, id)
    }

    const clearAll = () => {
        notifications.map(notification => clear(notification.id))
    }

    const colorCard = (seen) => {
        if (!seen) {
            return '#a8ffbf'
        }
        if (color) {
            return 'lightgray'
        }
    }
    return (
        < div >
            <Parallax small filter image={image}>
            </Parallax>

            <div className={classNames(classes.main, classes.mainRaised)} >
                <div className={classes.container}>
                    <GridContainer justify="center">
                        <GridItem>
                            <h2 className={secClasses.title}>Notifications {count > 0 && `(${count} Unread)`}</h2>
                        </GridItem>
                        <GridItem>
                        <Button onClick={() => clearAll()}>
                            <h4>Clear All</h4>
                        </Button>
                        </GridItem>
                    </GridContainer>
                    <GridContainer justify="center">
                        <GridItem>
                            {
                                notifications.length > 0 ?
                                    notifications.map(notification =>
                                        <Notification key={notification.id} {...notification}/>
                                    )
                                    :
                                    <Card>
                                        <CardBody>
                                            <h3 className={secClasses.title}> No Notifications</h3>
                                        </CardBody>
                                    </Card>
                            }


                        </GridItem>
                    </GridContainer>
                </div>


            </div>
            <Footer />
        </div >
    );
}