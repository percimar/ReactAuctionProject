import React, { useState, useContext, useEffect } from "react";
import db from '../db'
import GridItem from "../components/Grid/GridItem.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'
import Parallax from "../components/Parallax/Parallax.js";
import GridContainer from "../components/Grid/GridContainer.js";
import classNames from "classnames";
import Footer from "../components/Footer/Footer.js";
import image from "../assets/img/bg8.jpg";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";

const useStyles = makeStyles(styles);

export default function About() {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    return (

        <div>
            <Parallax filter image={image}>
                <div className={classes.container}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <h1 className={classes.title}>About Us</h1>
                        </GridItem>
                    </GridContainer>
                </div>
            </Parallax>
            <div className={classNames(classes.main, classes.mainRaised)}>
                <div className={classes.container}>

                    <Card style={{}} >
                        <br />
                        <div style={{ textAlign: "center" }}>
                            <h1>Welcome to MotorMob</h1>
                        </div>
                        <CardBody>
                            <div style={{ textAlign: "center" }}>
                                <h3>
                                    Founded in 2020, MotorMob is a leading international marketplace for classic and performance cars.
                                    The market offers an outstanding selection of cars from sellers around the world.
                                    Our headquarters are located in Qatar and we have offices in Doha.
                                </h3>
                            </div>
                            <br />
                        </CardBody>
                    </Card>

                </div>
            </div>
            <Footer />
        </div>
    )
}
