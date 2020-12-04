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
import image1 from "assets/img/bg8.jpg";
import image2 from "assets/img/bg8.jpg";
import image3 from "assets/img/bg8.jpg";
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

    const classes = useStyles();
    const secClasses = useSecStyles();

    const [notifications, setNotifications] = useState([])
    useEffect(() => db.Users.Notifications.listenToNotifications(setNotifications, user.id), [])

    return (
        < div >
            <Parallax small filter image={image}>
                {/* <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>Notifications</h1>
            </GridItem>
          </GridContainer>
        </div> */}
            </Parallax>

            <div className={classNames(classes.main, classes.mainRaised)} >
                <div className={classes.container}>
                    <GridContainer justify="center">
                        <GridItem>
                            <h2 className={secClasses.title}>Notifications</h2>
                        </GridItem>
                    </GridContainer>
                    <GridContainer justify="center">
                        <GridItem>
                            {
                                notifications.map(notification=>
                                        <Card key={notification.id}>
                                            <CardBody>
                                                <h3 className={secClasses.title}> {notification.title}</h3>
                                                <h3 className={secClasses.description}>
                                                    {notification.description}
                                                </h3>
                                                <h3 className={secClasses.description}>
                                                    {notification.timestamp.toString()}
                                                </h3>
                                            </CardBody>
                                        </Card>
            
                                )
                            }


                        </GridItem>
                    </GridContainer>
                </div>


            </div>
            <Footer />
        </div >
    );
}
