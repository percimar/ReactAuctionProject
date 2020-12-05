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
import Button from '@material-ui/core/Button'
import image1 from "assets/img/bg8.jpg";
import image2 from "assets/img/bg8.jpg";
import image3 from "assets/img/bg8.jpg";
import { useHistory, Link } from "react-router-dom";
import CardHeader from "components/Card/CardHeader";
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

export default function Notification({ id, title, description, timestamp, link, viewed }) {

    const { user } = useContext(UserContext)
    const history = useHistory()
    const classes = useStyles();
    const secClasses = useSecStyles();

    const [color, setColor] = useState(false)

    const mouseHover = () => {
        if (!viewed) {
            db.Users.Notifications.markSeen(user.id, { id, title, description, timestamp, link, viewed })
        }
        setColor(true)
    }

    const clear = () => {
        db.Users.Notifications.clearNotification(user.id, id)
    }

    const colorCard = (seen) => {
        if (!seen) {
            return '#ffe08a'
        }
        if (color) {
            return '#ededed'
        }
    }
    return (
        <Card 
            style={{ backgroundColor: colorCard(viewed) }}
            key={id}
            onMouseOver={mouseHover}
            onMouseOut={() => setColor(false)}
        >
            <CardBody>
                <Button onClick={clear}>Clear</Button>
                <div onClick={() => history.push(link)}>
                    <h3 className={secClasses.title}> {title}</h3>
                    <h3 className={secClasses.description}>
                        {description}
                    </h3>
                    <h3 className={secClasses.description}>
                        {timestamp.toString()}
                    </h3>
                </div>
            </CardBody>
        </Card>
    )


}