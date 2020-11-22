
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
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
import db from '../db'
import Item from './Item'
import { Link } from 'react-router-dom';


import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CustomInput from "../components/CustomInput/CustomInput.js";
import { useHistory } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

const useStyles = makeStyles(styles);

export default function Auction({ set, id, displayName, finish, start, status }) {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");

    //fix for unmount error
    useEffect(() => {
        const clear = setTimeout(() => setCardAnimation(""), 700)
        return () => clearTimeout(clear)
    }, [])


    const classes = useStyles();

    const [classicModal, setClassicModal] = React.useState(false);

    const [view, setView] = useState('details')

    const [seller, setSeller] = useState({ name: "" })
    // useEffect(() => {
    //     if (user) {
    //         return db.Users.listenOne(setSeller, sellerId)
    //     }
    // }, [sellerId, user])

    const [item, setItem] = useState({ name: "" })
    // useEffect(() => db.Users.listenToUserItem(setItem, sellerId, itemId), [sellerId, itemId])    --defunct (remove or keep?)

    const [items, setItems] = useState(null)
    useEffect(() => db.Auctions.Items.listenToOneAuctionAllItems(setItems, id), [id])

    const [bids, setBids] = useState([])
    // useEffect(() => db.Auctions.listenToAuctionBids(setBids, id), [id])

    const [amount, setAmount] = useState(0)

    const highestBid = () => Math.max(...bids.map(bid => bid.amount), 0)

    const valid = () => amount > highestBid()

    const bid = async () => {
        await db.Auctions.createAuctionBid(id, { amount, buyerId: user.id, when: new Date() })
        setClassicModal(false)
    }
    // hi
    const history = useHistory()

    const attemptBid = () => {
        if (user) {
            setClassicModal(true)
        } else {
            history.push("/login")
        }
    }

    const seeDetails = () => {
        setClassicModal(true)
    }

    return (
        <>
            <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[cardAnimaton]}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                        {displayName}
                        {/* <img src={picture} alt="item" style={{ width: '100px', height: '100px ' }} /> */}
                    </CardHeader>
                    <CardBody>
                        {/* {
                            user
                            &&
                            <>
                                <Primary>
                                    Name
                                </Primary>
                                <Info>
                                    {displayName}
                                </Info>
                                <br />
                            </>
                        } */}
                        <Primary>
                            Start
                        </Primary>
                        <Info>
                            {start.toDateString()}
                        </Info>
                        <br />
                        <Primary>
                            Finish
                        </Primary>
                        <Info>
                            {finish.toDateString()}
                        </Info>
                        {/* <br />
                        <Primary>
                            Highest Bid So Far
                    </Primary>
                        <Info>
                            {highestBid()}
                        </Info> */}
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                        <Button color="primary" size="sm" onClick={() => set(id)}>
                            See Details
                        </Button>
                    </CardFooter>
                </Card>
            </GridItem>

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
                    <h4 className={classes.modalTitle}>Auction Details</h4>
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                {/* <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                >
                    Enter an amount higher than {highestBid()}
                    <CustomInput
                        labelText="Amount"
                        id="amount"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            onChange: event => setAmount(event.target.value),
                            value: amount,
                            type: "number"
                        }}
                    />
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                    <Button
                        onClick={() => setClassicModal(false)}
                        color="danger"
                        simple
                    >
                        Cancel
                    </Button>
                    <Button color="transparent" simple onClick={bid} disabled={!valid()}>
                        Bid
                    </Button>

                </DialogActions> */}
            </Dialog>
        </>
    )
}