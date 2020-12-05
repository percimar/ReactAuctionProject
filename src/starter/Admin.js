import React, { useState, useEffect } from "react";
import db from '../db'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import image from "../assets/img/bg8.jpg";
import Parallax from "../components/Parallax/Parallax.js";

const useStyles = makeStyles(styles);

export default function Admin() {

    const classes = useStyles();

    const [users, setUsers] = useState(0)
    useEffect(() => db.Users.listenToCount(setUsers), [])

    const reset = async () => {

        // delete all auctions
        const auctions = await db.Auctions.findAll()
        await Promise.all(
            auctions.map(
                async auction => {
                    const bids = await db.Auctions.findAuctionBids(auction.id)
                    await Promise.all(
                        bids.map(bid => db.Auctions.removeAuctionBid(auction.id, bid.id))
                    )
                    await db.Auctions.remove(auction.id)
                }
            )
        )

        // delete all users except admin
        const users = await db.Users.findByRole('user')
        await Promise.all(
            users.map(
                async user => {
                    const items = await db.Users.findUserItems(user.id)
                    await Promise.all(
                        items.map(item => db.Users.removeUserItem(user.id, item.id))
                    )
                    await db.Users.remove(user.id)
                }
            )
        )

    }

    const addSampleData = async () => {

        // get all users (if just reset, logout and login as existing user to generate user document in db)
        // add sample items, auctions, and bids for them

        // const users = await db.Users.findByRole('user')
        // await Promise.all(
        //     users.map(
        //         async user => {
        //             const itemDoc = await db.Users.createUserItem(user.id, { name: 'Cat', description: 'Furry', picture: "" })
        //             const auctionDoc = await db.Auctions.create({ sellerId: user.id, itemId: itemDoc.id, buyerId: "", start: new Date(), finish: new Date(), status: ""})
        //             await db.Auctions.createAuctionBid(auctionDoc.id, { amount: 10, buyerId: user.id, when: new Date() })
        //         }
        //     )
        // )
        //add sample auctions
    }

    return (
        <>
            <Parallax filter image={image}>
                <div className={classes.container}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={4}>
                            <h1 className={classes.title}>Admin Dashboard</h1>
                        </GridItem>
                    </GridContainer>
                </div>
            </Parallax>
            <div className={classes.section} style={{ textAlign: "center" }}>
                {/* <h2 className={classes.title}>Admin Dashboard</h2> */}
                <div>
                    <Card>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={4}>
                                <Card plain>
                                    <h4 className={classes.cardTitle} style={{ color: "black" }}>
                                        Total number users
                                    <br />
                                        {users}
                                    </h4>
                                </Card>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={4}>
                                <Card plain>
                                    <h4 className={classes.cardTitle} style={{ color: "black" }}>
                                        Reset Database
                                    <br />
                                        <Button onClick={reset}>Go</Button>
                                    </h4>
                                    <h4 className={classes.cardTitle} style={{ color: "black" }}>
                                        Add Sample Data
                                    <br />
                                        <Button onClick={addSampleData}>Go</Button>
                                    </h4>
                                </Card>
                            </GridItem>
                        </GridContainer>
                    </Card>
                </div>
            </div>
        </>
    );
}
