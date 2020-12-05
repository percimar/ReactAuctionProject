
import React, { useEffect, useState, useContext } from 'react';
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import Info from "../components/Typography/Info.js";
import Primary from "../components/Typography/Primary.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";
import { useParams } from 'react-router-dom';
import db from '../db'
import Item from './Item'
import GridContainer from "../components/Grid/GridContainer.js";
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import UserContext from '../UserContext'
import { useHistory, Link } from 'react-router-dom';
import ItemForm from './ItemForm'

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import CustomInput from "../components/CustomInput/CustomInput.js";
import Parallax from "../components/Parallax/Parallax.js";
import image from "../assets/img/bg8.jpg";
import classNames from "classnames";
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
const useStyles = makeStyles(styles);

export default function AuctionItems() {
    console.log("AUCTION ITEMS")

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="down" ref={ref} {...props} />;
    });

    Transition.displayName = "Transition";

    const [cardAnimaton, setCardAnimation] = useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { user } = useContext(UserContext)

    let { AuctionId } = useParams();

    const [items, setItems] = useState([])

    useEffect(() => {
        db.Auctions.Items.listenToOneAuctionAllItems(setItems, AuctionId)
    }, [AuctionId])

    // useEffect(() => db.Auctions.Items.listenOnlyCategories(setCategories, AuctionId))
    // console.log(categories)

    // useEffect(() => items.map(item => setCategories(categories => [...categories, item.catId]), [items]))

    const [auction, setAuction] = useState(null)
    useEffect(() => {
        db.Auctions.listenOne(setAuction, AuctionId)
    }, [])

    const [addItem, setAddItem] = useState(false)

    const [classicModal, setClassicModal] = useState(false)
    useEffect(() => {
        auction && auction.status == 'Closed' && setClassicModal(true)
    }, [auction])

    const [confirmModal, setConfirmModal] = useState(false)

    const [confirm, setConfirm] = useState(false)



    const openConfirm = () => {
        setConfirm(true)
    }

    // if(auction && auction.status == 'Closed') {
    //     setClassicModal(true)
    // } 

    const closeAuction = () => {
        setConfirmModal(false)
        db.Auctions.update({ id: AuctionId, displayName: auction.displayName, start: auction.start, finish: auction.finish, status: "Closed" })
        notifyWinners()
        setClassicModal(true)
    }


    const [Followedauction, setFollowing] = useState(null)
    useEffect(() => db.Users.Following.listenToFollowingByAuction(setFollowing, user.id, AuctionId))

    const addfollow = () => {
        db.Users.Following.addFollowing(user.id, { auctionId: AuctionId, notifications: false })
    }
    const removefollow = () => {
        db.Users.Following.removeOneFollowing(user.id, Followedauction[0].id)
    }

    const notifyWinners = async () => {
        items.map(async (item) => {
            let bids = await db.Auctions.Items.Bids.findAllBids(AuctionId, item.id)
            if (bids.length > 0) {
                let highest = Math.max(...bids.map(bid => bid.amount), 0)
                let winningBid = await db.Auctions.Items.Bids.findByAmount(AuctionId, item.id, highest)
                db.Users.Notifications.sendNotification(winningBid[0].bidderUserId,
                    {
                        title: 'You have won an item!',
                        description: `You have won the ${item.name} from the ${auction.displayName}. Decide how to receive your item`
                    })
            }
        })

    }

    return (

        <div>
            <Parallax small filter image={image}>
            </Parallax>
            <div className={classNames(classes.main, classes.mainRaised)} >
                <div className={classes.section}>
                    {
                        <div className={classes.section}>
                            <GridContainer justify="center">
                                <GridItem xs={12} sm={12} md={8}>
                                    <h2 className={classes.title}>Auction Items</h2>
                                </GridItem>
                                <GridItem xs={12} sm={12} md={8}>
                                    {
                                        user && user.role != 'user' &&
                                        <>
                                            <Button simple color="primary" size="lg" onClick={() => setAddItem(!addItem)}>{!addItem ? 'Add Item' : 'Close Form'}</Button>
                                            {
                                                !confirm ?
                                                    <Button color="danger" size="lg" onClick={() => openConfirm()}>Close Auction</Button>
                                                    :
                                                    <>
                                                        <Button color="transparent" size="sm" onClick={() => setConfirm(false)}> Back </Button>
                                                        <Button color="danger" size="lg" onClick={() => closeAuction()}>Confirm?</Button>
                                                    </>
                                            }
                                            <Button simple color="primary" size="lg">Show Pending Items</Button>
                                        </>
                                    }
                                </GridItem>
                            </GridContainer>
                            <GridContainer style={{ marginTop: '5%' }}>
                                {
                                    addItem &&
                                    <ItemForm auctionId={AuctionId} setView={setAddItem} />
                                }
                                {
                                    items.map(item => <Item key={item.id} auctionId={AuctionId} {...item} />)
                                }
                            </GridContainer>

                            <Dialog
                                classes={{
                                    root: classes.center,
                                    paper: classes.modal
                                }}
                                open={classicModal}
                                TransitionComponent={Transition}
                                keepMounted
                                disableBackdropClick
                                onClose={() => setClassicModal(false)}
                                aria-labelledby="classic-modal-slide-title"
                                aria-describedby="classic-modal-slide-description"
                            >
                                <DialogTitle
                                    id="classic-modal-slide-title"
                                    disableTypography
                                    className={classes.modalHeader}
                                >
                                </DialogTitle>
                                <DialogContent>
                                </DialogContent>
                                <DialogContent
                                    id="classic-modal-slide-description"
                                    className={classes.modalBody}
                                >
                                    This Auction has been closed by an admin or moderator
                            <br />
                                Click the button below to return to auctions page
                            </DialogContent>
                                <DialogContent
                                    id="classic-modal-slide-description"
                                    className={classes.modalBody}
                                >
                                    This Auction has been closed by {user?.name}
                                    <br />
                                Click the button below to return to auctions page
                            </DialogContent>
                                <DialogActions className={classes.modalFooter}>
                                    <Button
                                        component={Link} to={`/`}
                                        color="primary"
                                        simple
                                    >
                                        Return to auctions
                                    </Button>
                                </DialogActions>
                            </Dialog>

                        </div>
                    }
                </div>
                <div style={{ textAlign: "center" }}>

                    <Button size="lg" color="primary" component={Link} to={`/`} >
                        <i className="material-icons">
                            west
                        </i>
                        &nbsp;&nbsp;&nbsp;
                        Back to Auctions
                    </Button>
                    {
                        Followedauction == null || Followedauction.length == 0 ?
                            <>
                                <Button simple size="lg" color="primary" onClick={() => addfollow()}>
                                    <FavoriteBorderIcon />
                                    Favourite Auction
                            </Button></>
                            :
                            <Button simple color="primary" size="lg" onClick={() => removefollow()}>
                                <FavoriteIcon />
                                Remove from Favourite
                            </Button>
                    }
                </div>
            </div>
        </div >

    )
}