
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


const useStyles = makeStyles(styles);

export default function AuctionItems() {

    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="down" ref={ref} {...props} />;
    });

    Transition.displayName = "Transition";

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const { user } = useContext(UserContext)

    let { AuctionId } = useParams();

    const [items, setItem] = useState([])
    useEffect(() => db.Auctions.Items.listenToOneAuctionAllItems(setItem, AuctionId), [AuctionId])


    const [addItem, setAddItem] = useState(false)

    const [editItem, setEditItem] = useState(false)

    const [classicModal, setClassicModal] = useState(false)

    const [confirmModal, setConfirmModal] = useState(false)

    const [confirm, setConfirm] = useState(false)

    const openConfirm = (e) => {
        setConfirm(true)
    }

    const closeAuction = () => {
        setConfirmModal(false)
        db.Auctions.update({ id: AuctionId, status: "Closed" })
        setClassicModal(true)
    }

    return (

        < div >
            <Parallax filter image={image}>
            </Parallax>
            <div className={classNames(classes.main, classes.mainRaised)} >

                {
                    <>
                        <GridContainer justify="center">
                            <GridItem xs={12} sm={12} md={8} >
                                <h1 className={classes.title} style={{ textAlign: "center", color: "white" }}>Auction Items</h1>
                                <br />
                                {
                                    user && user.role === 'admin' &&
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
                        <GridContainer>
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
                                This Auction has been closed by {user.name}
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

                        {/* <Dialog
                        classes={{
                            root: classes.center,
                            paper: classes.modal
                        }}
                        open={confirmModal}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={() => setConfirmModal(false)}
                        aria-labelledby="confirm-modal-slide-title"
                        aria-describedby="confirm-modal-slide-description"
                    >
                        <DialogTitle
                            id="confirm-modal-slide-title"
                            disableTypography
                            className={classes.modalHeader}
                        >
                            <IconButton
                                className={classes.modalCloseButton}
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                onClick={() => setConfirmModal(false)}
                            >
                                <Close className={classes.modalClose} />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                        </DialogContent>
                        <DialogContent
                            id="confirm-modal-slide-description"
                            className={classes.modalBody}
                        >
                            Close this auction?
                            </DialogContent>
                        <DialogActions className={classes.modalFooter}>
                            <Button
                                onClick={() => closeAuction()}
                                color="danger"
                                simple
                            >
                                Close Auction
                        </Button>
                            <Button color="transparent" simple onClick={() => setConfirmModal(false)}>
                                Cancel
                        </Button>

                        </DialogActions>
                    </Dialog> */}

                    </>
                }
                <div style={{ textAlign: "center" }}>

                    <Button size="lg" color="primary" component={Link} to={`/`} >
                        <i className="material-icons">
                            west
                        </i>
                        &nbsp;&nbsp;&nbsp;
                        Back to Auctions
                    </Button>
                </div>



            </div>
        </div>


    )
}