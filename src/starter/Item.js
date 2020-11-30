
import React, { useContext, useState, useEffect } from "react";
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
import ItemForm from './ItemForm'

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CustomInput from "../components/CustomInput/CustomInput.js";
import { useHistory } from 'react-router-dom';

import db from '../db'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

const useStyles = makeStyles(styles);

export default function Item({ auctionId, id, name, description, picture }) {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);

    const { user } = useContext(UserContext)

    // const [highestBidQuery, setHighestBid] = useState([])
    // useEffect(() => {
    //     db.Auctions.Items.Bids.findHighest(auctionId, id, setHighestBid)
    //     setHighestBid(highestBidQuery[0])
    // }, [id])
    // console.log(highestBidQuery)

    const [bids, setBids] = useState([])
    useEffect(() => db.Auctions.Items.Bids.listenToOneItemAllBids(auctionId, id, setBids), [id])
    // console.log(bids)

    const valid = () => amount > highestBid()

    const [deleteModal, setDeleteModal] = useState(false)

    const [editForm, setEditForm] = useState(false)

    const [amount, setAmount] = useState(0)

    const highestBid = () => {
        return Math.max(...bids.map(bid => bid.amount), 0)
    }


    const classes = useStyles();

    const bid = () => {
        db.Auctions.Items.Bids.createBid(auctionId, id, { amount: amount * 1, bidderUserId: user.id, timestamp: new Date() })
        setClassicModal(false)
    }

    const remove = () => {
        db.Auctions.Items.removeOneItem(auctionId, id)
    }

    return (
        <>
            {
                !editForm ?
                    <>
                        <GridItem xs={12} sm={12} md={4}>

                            <Card className={classes[cardAnimaton]}>
                                <CardHeader color="primary" className={classes.cardHeader}>
                                    <img src={picture} alt="item" style={{ width: '100px', height: '100px ' }} />
                                </CardHeader>
                                <CardBody>
                                    <Primary>
                                        Name
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
                                    <br />
                                    <Primary>
                                        Highest Bid
                    </Primary>
                                    <Info>
                                        {highestBid()}
                                    </Info>
                                    {
                                        user && user.role == 'admin' &&
                                        <>
                                            <br />
                                            <Primary>
                                                Bids so far
                                </Primary>
                                            <Info>
                                                {bids.length}
                                            </Info>
                                        </>
                                    }
                                </CardBody>
                                <CardFooter className={classes.cardFooter}>
                                    {/*show bid if auction did not finish + item is available for bids*/}
                                    <Button color="primary" size="lg" onClick={() => setClassicModal(true)}>
                                        Bid
                        </Button>
                                </CardFooter>
                                <CardFooter className={classes.cardFooter}>
                                    <Button color="primary" size="sm" onClick={() => setEditForm(true)}>
                                        Edit
                        </Button>
                                    <Button color="danger" size="sm" onClick={() => remove(true)}>
                                        Remove
                        </Button>
                                </CardFooter>

                            </Card>

                        </GridItem>


                    </>
                    :
                    <>
                        <ItemForm auctionId={auctionId} setView={setEditForm} editObject={{ id, name, description, picture }} />
                    </>
            }
            <Dialog
                classes={{
                    root: classes.center,
                    paper: classes.modal
                }}
                open={deleteModal}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setDeleteModal(false)}
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
                        onClick={() => setDeleteModal(false)}
                    >
                        <Close className={classes.modalClose} />
                    </IconButton>
                    {/* <h4 className={classes.modalTitle}>Delete Auction?</h4> */}
                </DialogTitle>
                <DialogContent>
                </DialogContent>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                >
                    Delete {name}?
                        {/* <CustomInput
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
                        /> */}
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                    <Button
                        onClick={() => deleteAuction(id)}
                        color="danger"
                        simple
                    >
                        Delete
                        </Button>
                    <Button color="transparent" simple onClick={() => setDeleteModal(false)}>
                        Cancel
                        </Button>

                </DialogActions>
            </Dialog>
        </>

    )
}