//Carlos: Added categories

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

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CustomInput from "../components/CustomInput/CustomInput.js";
import { useHistory, Link } from 'react-router-dom';
import AuctionForm from './AuctionForm'

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

    const [deleteModal, setDeleteModal] = useState(false)

    const [view, setView] = useState('details')

    const [seller, setSeller] = useState({ name: "" })
    // useEffect(() => {
    //     if (user) {
    //         return db.Users.listenOne(setSeller, sellerId)
    //     }
    // }, [sellerId, user])

    // useEffect(() => db.Users.listenToUserItem(setItem, sellerId, itemId), [sellerId, itemId])    --defunct (remove or keep?)

    const [items, setItems] = useState([])
    useEffect(() => db.Auctions.Items.listenToOneAuctionAllItems(setItems, id), [id])


    const [categories, setCategories] = useState([])
    useEffect(() => {
        setCategories([])
        items.map(item => db.Categories.listenOne(setCategories, item.catId, categories))
    }, [items])

    console.log(categories)
    
    //for display
    // const [catNames, setCatNames] = useState([])
    // useEffect(() => {
    //     categories.map(item => !catNames.includes(item.name) && setCatNames(nameArray => [...nameArray, item.name]))
    // }, [categories])


    const [bids, setBids] = useState([])
    // useEffect(() => db.Auctions.listenToAuctionBids(setBids, id), [id])

    const [amount, setAmount] = useState(0)

    const highestBid = () => Math.max(...bids.map(bid => bid.amount), 0)

    const valid = () => amount > highestBid()

    const bid = async () => {
        await db.Auctions.createAuctionBid(id, { amount, buyerId: user.id, when: new Date() })
        setClassicModal(false)
    }

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

    const [editForm, setEditForm] = useState(false)

    const editAuction = () => {
        setEditForm(!editForm)
    }

    const confirmDelete = () => {
        setDeleteModal(true)
    }

    const deleteAuction = (id) => {
        // add map that removes items in auction
        db.Auctions.remove(id)
        setDeleteModal(false)
        console.log('deleted ' + id)
    }


    return (
        <>
            {
                !editForm ?
                    <>
                        <GridItem xs={12} sm={12} md={4}>
                            <Card className={classes[cardAnimaton]}>
                                <CardHeader color="primary" className={classes.cardHeader}>
                                    {displayName}
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
                                        {start.toDateString()} <br />
                                        {start.toTimeString().substring(0, 8)}
                                    </Info>
                                    <br />
                                    <Primary>
                                        Finish
                            </Primary>
                                    <Info>
                                        {finish.toDateString()} <br />
                                        {finish.toTimeString().substring(0, 8)}
                                    </Info>
                                    <br />
                                    <Primary>
                                        Categories
                                    </Primary>
                                    <Info>
                                        {
                                        // catNames.map(item => item).join(', ')
                                        categories.map(item => item.name).join(', ')
                                        }
                                    </Info>
                                    <br/>
                                    <Primary>
                                        Accepting Item Submissions
                                    </Primary>
                                </CardBody>
                                <CardFooter className={classes.cardFooter}>

                                    {/* <Button color="primary" size="sm" onClick={showItems}>
                                Show Items
                                </Button> */}
                                    <Button size="sm" color="primary" component={Link} to={`/auction/items/${id}`}>Show Items</Button>

                                    {/* <Button color="primary" size="sm" onClick={() => set(id)}>
                                        See Details
                                </Button> */}
                                    {
                                        user && user.role == 'admin' &&
                                        <Button color="primary" size="sm" onClick={() => editAuction()}>
                                            Edit
                                </Button>
                                    }

                                    <Button color="primary" size="sm" onClick={() => confirmDelete(id)}>
                                        X
                                </Button>
                                </CardFooter>
                            </Card>
                        </GridItem>

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
                                Delete {displayName}?
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
                    :
                    <AuctionForm editObject={{ id, displayName, finish, start }} open={setEditForm} />
            }
        </>

    )
}