
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
import ItemForm from '../starter/ItemForm'

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

export default function ResultItem({ auctionId, id, name, description, picture, sellerUserId }) {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);

    const { user } = useContext(UserContext)

    const history = useHistory()

    const attemptBid = () => {
        if (user) {
            setClassicModal(true)
        } else {
            history.push("/login")
        }
    }

    const [bids, setBids] = useState([])
    useEffect(() => db.Auctions.Items.Bids.listenToOneItemAllBids(auctionId, id, setBids), [id])
    // console.log(bids)

    const valid = () => amount > highestBid()

    const [deleteModal, setDeleteModal] = useState(false)

    const [classicModal, setClassicModal] = useState(false)

    const [editForm, setEditForm] = useState(false)

    const [amount, setAmount] = useState(0)

    const highestBid = () => {
        return Math.max(...bids.map(bid => bid.amount), 0)
    }

    const classes = useStyles();

    const [seller, setSeller] = useState([])
    useEffect(() => db.Users.listenOne(setSeller, sellerUserId), [sellerUserId])

    const confirmDelete = () => {
        setDeleteModal(true)
    }

    const remove = () => {
        setDeleteModal(false)
        db.Auctions.Items.removeOneItem(auctionId, id)
    }

    return (
        <>
            {
                !editForm ?
                    <>
                        <GridItem xs={12} sm={12} md={4}>

                            <Card className={classes[cardAnimaton]} style={{ height: "420px", width: "400px", textAlign: "center", marginLeft: "15px" }}>
                                <CardHeader color="primary" className={classes.cardHeader}>
                                    <img src={picture} alt="item" style={{ width: '100px', height: '100px' }} />
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
                                        Winning Bid
                                    </Primary>
                                    <Info>
                                        {highestBid()}
                                    </Info>
                                    <br />
                                    <Primary>
                                        Seller
                                    </Primary>
                                    <Info>
                                        {seller.name}
                                    </Info>
                                </CardBody>
                                {
                                    user && user.role == 'admin' &&
                                    <>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button color="danger" size="sm" onClick={() => confirmDelete()}>
                                                Remove
                                            </Button>
                                        </CardFooter>
                                    </>
                                }


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
                aria-labelledby="delete-modal-slide-title"
                aria-describedby="delete-modal-slide-description"
            >
                <div style={{ textAlign: "center" }}>
                    <DialogTitle
                        id="delete-modal-slide-title"
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
                    </DialogTitle>
                    <DialogContent
                        id="classic-modal-slide-description"
                        className={classes.modalBody}
                    >
                        Delete {name}?
                </DialogContent>
                </div>
                <DialogActions className={classes.modalFooter}>
                    <Button
                        onClick={() => remove(id)}
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