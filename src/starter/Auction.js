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
import Danger from '../components/Typography/Danger.js'
import Success from '../components/Typography/Success'
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

    useEffect(() => closeByDate(), [])

    const [items, setItems] = useState([])
    useEffect(() => db.Auctions.Items.listenToOneAuctionAllItems(setItems, id), [id])


    const [categories, setCategories] = useState([])
    useEffect(() => {
        setCategories([])
        items.map(item => db.Categories.collectOne(setCategories, item.catId, categories))
    }, [items])

    const [catNames, setCatNames] = useState([])
    useEffect(() => {
        setCatNames([])
        categories.map(category => setCatNames(catNames => [...catNames, category.name]))
    }, [categories])

    const [counter, setCounter] = useState(1000)
    useEffect(() => {        
        // console.log(date === finish)
        const timer = 
            new Date() < finish && setInterval(() => setCounter(Math.floor(Math.abs(finish-new Date())/1000-1), 1000));
            return () => {
                closeByDate()
                clearInterval(timer)
            }
    }, [counter, finish])

    const history = useHistory()


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
    }

    const drawNames = () => {
        return [...new Set(catNames)]
    }

    const closeByDate = () => {
        if(new Date >= finish) {
            db.Auctions.update({id, displayName, finish, start, status:'Closed'})
        }
            
    }
    return (
        <>
            {
                !editForm ?
                    <>
                    
                        <GridItem xs={12} sm={12} md={4}>
                            <Card className={classes[cardAnimaton]} style={{ height: "420px" }}>
                                <CardHeader color="primary" className={classes.cardHeader}>
                                    {displayName}
                                </CardHeader>
                                <CardBody>
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
                                        {catNames.length > 0 ? drawNames().join(', ') : 'No Items Added'}
                                    </Info>
                                    <br />
                                    <Primary>
                                        Time left
                                    </Primary>
                                    <Info>
                                        {/* {counter} */}
                                        {~~(counter/3600)}h {~~((counter%3600)/60)}m {counter >=0 ? ~~counter%60 : 0}s
                                    </Info>
                                    <br />
                                    <Success>
                                        Accepting Item Submissions
                                    </Success>
                                </CardBody>
                                <CardFooter className={classes.cardFooter}>
                                    <Button size="sm" color="primary" component={Link} to={`/auction/items/${id}`}>Show Items</Button>
                                    {
                                        user && user.role == 'admin' &&
                                        <>
                                        <Button color="primary" size="sm" onClick={() => editAuction()}>
                                            Edit
                                        </Button>
                                         <Button color="primary" size="sm" onClick={() => confirmDelete(id)}>
                                         X
                                        </Button>
                                        </>
                                    }
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
                    <AuctionForm editObject={{ id, displayName, finish, start }} open={setEditForm}/>
            }
        </>

    )
}