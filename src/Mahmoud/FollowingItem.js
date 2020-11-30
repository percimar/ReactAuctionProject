
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

export default function Following({ id }) {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const { user } = useContext(UserContext)

    const [Followedauction, setFollowedAuction] = useState("")
    useEffect(() => db.Auctions.listenOne(setFollowedAuction, id), [user])

    return (
        <>
            <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[cardAnimaton]}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                        {/* <img src={picture} alt="item" style={{ width: '100px', height: '100px ' }} /> */}
                    </CardHeader>
                    <CardBody>
                        <Primary>
                            Name
                                </Primary>
                        <Info>
                            {Followedauction.displayName}
                        </Info>
                        <Primary>
                            Status
                                </Primary>
                        <Info>
                            {Followedauction.status}
                        </Info>
                        <br />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                        <Button simple color="primary" size="lg" onClick={() => <AuctionDetails id={id} />}>See Auction Details</Button>
                    </CardFooter>
                </Card>
            </GridItem>
        </>
    )
}