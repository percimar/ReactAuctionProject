
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../../UserContext'
import GridItem from "../../components/Grid/GridItem.js";
import Button from "../../components/CustomButtons/Button.js";
import Card from "../../components/Card/Card.js";
import CardBody from "../../components/Card/CardBody.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardFooter from "../../components/Card/CardFooter.js";
import Info from "../../components/Typography/Info.js";
import Primary from "../../components/Typography/Primary.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../../assets/jss/material-kit-react/views/loginPage.js";
import db from '../../db'

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CustomInput from "../../components/CustomInput/CustomInput.js";
import { useHistory } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

const useStyles = makeStyles(styles);

export default function Category({ set, category, id, description, name }) {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");

    //fix for unmount error
    useEffect(() => {
        const clear = setTimeout(() => setCardAnimation(""), 700)
        return () => clearTimeout(clear)
    }, [])

    const classes = useStyles();

    const [classicModal, setClassicModal] = React.useState(false);

    const history = useHistory()


    return (
        <>
            <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[cardAnimaton]}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                        {/* <img src={picture} alt="item" style={{ width: '100px', height: '100px ' }} /> */}
                    </CardHeader>
                    <CardBody>
                        <Primary>
                            Category
                        </Primary>
                        <Info>
                            {name}
                        </Info>
                        <br />
                        <Primary>
                            Description
                        </Primary>
                        <Info>
                            {description}
                        </Info>
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                        <Button color="primary" size="sm" onClick={() => set(id, name)}>
                            See Auctions in Category
                            </Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </>
    )
}