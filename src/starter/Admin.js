import React, { useState, useEffect, useContext } from "react";
import db from '../db'
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import landingStyles from "../assets/jss/material-kit-react/views/landingPage"
import image from "../assets/img/bg8.jpg";
import Parallax from "../components/Parallax/Parallax.js";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import List from '@material-ui/core/List';
import UserListEntry from './UserListEntry'

const useStyles = makeStyles(styles);
const useLandingStyles = makeStyles(landingStyles)

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

export default function Admin() {


    const { user } = useContext(UserContext)

    const classes = useStyles();
    const landingClasses = useLandingStyles();

    const [usersCount, setUsersCount] = useState(0)
    useEffect(() => db.Users.listenToCount(setUsersCount), [])

    const [users, setUsers] = useState([])
    useEffect(() => db.Users.listenAllNotAdmin(setUsers), [])
    console.log(users)

    const [classicModal, setClassicModal] = useState(false)

    // const [testPrice, setTestPrice] = useState(1)

    // const [selected, setSelected] = useState([])
    // const [moderators, setModerators] = useState([])
    // useEffect(() => db.Users.listenByRole(setModerators, 'role'), [users])

    const reset = async () => {

        // delete all auctions
        const auctions = await db.Auctions.findAll()
        await Promise.all(
            auctions.map(
                async auction => {
                    let items = db.Auctions.Items.findOneAuctionAllItems(auction.id)
                    await Promise.all(
                        items.map(
                            item => {
                                db.Auctions.Items.removeOneItem(auction.id, item.id)
                            }
                        )
                    )
                }
            )
        )

        //delete all adverts
        const adverts = await db.Adverts.findAll()
        await Promise.all(
            adverts.map(
                advert => db.Adverts.remove(advert.id)
            )
        )

        //delete all bugs
        const bugs = await db.Bugs.findAll()
        await Promise.all(
            bugs.map(
                bug => db.Bugs.remove(bug.id)
            )
        )

        //delete all categories
        const categories = await db.Categories.findAll()
        await Promise.all(
            categories.map(
                category => db.Category.remove(category.id)
            )
        )

        //delete all faqs
        const faqs = await db.FAQs.findAll()
        await Promise.all(
            faqs.map(
                faq => db.FAQs.remove(faq.id)
            )
        )

        //delete all logs
        const logs = await db.Logs.findAll()
        await Promise.all(
            logs.map(
                log => db.Logs.remove(log.id)
            )
        )

        // const auctions = await db.Auctions.findAll()
        // await Promise.all(
        //     auctions.map(
        //         async auction => {
        //             const bids = await db.Auctions.findAuctionBids(auction.id)
        //             await Promise.all(
        //                 bids.map(bid => db.Auctions.removeAuctionBid(auction.id, bid.id))
        //             )
        //             await db.Auctions.remove(auction.id)
        //         }
        //     )
        // )

        // delete all users except admin
        // const users = await db.Users.findByRole('user')
        // await Promise.all(
        //     users.map(
        //         async user => {
        //             await db.Users.remove(user.id)
        //         }
        //     )
        // )

    }

    const addSampleData = async () => {

        // get all users (if just reset, logout and login as existing user to generate user document in db)
        // add sample items, auctions, and bids for them

        // const users = await db.Users.findAllUsersNotAdmin()
        // await Promise.all(
        //     users.map(
        //         async user => {
        //             // const itemDoc = await db.Users.createUserItem(user.id, { name: 'Cat', description: 'Furry', picture: "" })
        //             // const auctionDoc = await db.Auctions.create({ sellerId: user.id, itemId: itemDoc.id, buyerId: "", start: new Date(), finish: new Date(), status: ""})
        //             await db.Auctions.createAuctionBid(auctionDoc.id, { amount: 10, buyerId: user.id, when: new Date() })
        //         }
        //     )
        // )

        // add sample auctions
        await Promise.all(
            await db.Auctions.create({
                displayName: 'Used Cars Auction',
                start: new Date("December 10, 2020 12:00:00"),
                finish: new Date("December 20, 2020 12:00:00"),
                status: 'Ongoing'
            }),
            await db.Auctions.create({
                displayName: "Therapist's Cars",
                start: new Date("December 10, 2020 12:00:00"),
                finish: new Date("December 20, 2020 12:00:00"),
                status: 'Ongoing'
            })
        )

        //add sample categories
        await Promise.all(
            await db.Categories.create({
                name: 'Second Hand Cars',
                description: 'These cars have seen use but have not accumulated enough mileage or wear and tear to justify being scrapped.'
            })
        )

        //add sample items for each auction
        let auctions = db.Auctions.findAll()
        await Promise.all(
            auctions.map(
                async auction => {
                    await db.Auctions.Items.addItem(auction.id, {
                        name: 'Kia Picanto 2015',
                        description: `Goes vroom vroom best car 2015 has like 4 wheels and automatic transmission 
                        but not fully automatic like you still gotta put it in park or reverse and stuff but other than that 
                        it's automatic oh and great a/c`,
                        picture: `https://firebasestorage.googleapis.com/v0/b/cp3330-project-141af.appspot.com/
                        o/cars%2FKzaXsUb0rEZnSdBYnhCZ?alt=media&token=280eb058-8dfc-4634-8470-8a2540697c28`,
                        sellerUserId: user.id
                    })
                }
            )
        )

        //add sample comments 
        await Promise.all(
            users.map(
                async user => {
                    auctions.map(
                        async auction => {
                            let items = await db.Auctions.Items.findOneAuctionAllItems(auction.id)
                            await Promise.all(
                                items.map(async item => {
                                    await db.Auctions.Items.Comments.addComment(auction.id, item.id, {
                                        userId: user.id,
                                        timestamp: new Date(),
                                        comment: 'How fast does it go?'
                                    })
                                })
                            )

                        }
                    )
                }
            )
        )

        //add sample replies
        await Promise.all(
            users.map(
                auctions.map(
                    async auction => {
                        let items = await db.Auctions.Items.findOneAuctionAllItems(auction.id)
                        items.map(async item => {
                            let comments = await db.Auctions.Items.Comments.findOneItemAllComments()
                            comments.map(comment => {
                                db.Auctions.Items.Comments.Replies.addReply(auction.id, item.id, comment.id, {
                                    reply: 'top speed 200km/h',
                                    timestamp: new Date()
                                })
                            })
                        })
                    }
                )
            )
        )

        //add sample bug
        await Promise.all(
            await db.Bugs.create({
                bug: 'Test Bug',
                reporterUserId: user.id,
                severity: 'low',
                status: 'pending'
            })
        )

    //end is here
    }

    const [moderators, setModerators] = useState([])
    console.log(moderators)

    const addModerators = async () => {
        // console.log()
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
                <GridContainer justify="center">
                    <GridItem xs={12} sm={12} md={4}>
                        <Card>
                            <List dense className={classes.root}>
                                <h3>Moderator Privileges</h3>
                                {
                                    users.map(user => <UserListEntry key={user.id} array={moderators} set={setModerators} {...user} />
                                    )
                                }
                            </List>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card>
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
                        <Card>
                            <h4 className={classes.cardTitle}>
                                Total number users
                                    <br />
                                {usersCount}
                            </h4>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div >
            <Dialog
                classes={{
                    root: classes.center,
                    paper: classes.modal
                }}
                open={classicModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setClassicModal(false)}
                aria-labelledby="classic-modal-slide-title"
                aria-describedby="classic-modal-slide-description"
            >
                <DialogTitle
                    id="classic-modal-slide-title"
                    disableTypography
                    className={classes.modalHeader}
                >

                    <IconButton
                        className={classes.modalCloseButton}
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => setClassicModal(false)}
                    >
                        <Close className={classes.modalClose} />
                    </IconButton>

                        Add Moderators
                        {/* <h4 className={classes.modalTitle}>Delete Auction?</h4> */}
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                >
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                    <Button
                        onClick={() => addModerators(id)}
                        color="danger"
                        simple
                    >
                        Delete
                            </Button>
                    <Button color="transparent" simple onClick={() => setClassicModal(false)}>
                        Cancel
                            </Button>

                </DialogActions>
            </Dialog>
        </>
    );
}
