
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
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import CardContent from '@material-ui/core/CardContent';
import SendIcon from '@material-ui/icons/Send';
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import InputAdornment from "@material-ui/core/InputAdornment";
import Slide from "@material-ui/core/Slide";
import CustomInput from "../components/CustomInput/CustomInput.js";
import { useHistory, Link } from 'react-router-dom';

import db from '../db'
import Comment from '../Asmar/Comment'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

const useStyles = makeStyles(styles);

export default function Item({ auctionId, id, name, description, picture, sellerUserId, catId }) {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);

    const { user } = useContext(UserContext)

    const history = useHistory()

    const [comments, setComments] = useState([]);
    useEffect(() => db.Auctions.Items.Comments.listenToOneItemAllComments(setComments, auctionId, id), [])

    // useEffect(() => comments.map(comment => {
    //     const getData = async () => {
    //         return {
    //             replies: await db.Auctions.Items.Comments.Replies.findOneCommentAllReplies(auctionId, id, comment.id),
    //             ...comment
    //         };
    //     }
    //     return getData();
    // }), [comments])

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [comment, setComment] = useState("");

    const addComment = () => {
        db.Auctions.Items.Comments.addComment(auctionId, id, { userId: user.id, timestamp: new Date(), comment })
        setComment(""); //clear TextField
    }

    const attemptBid = () => {
        if (user) {
            setClassicModal(true)
        } else {
            history.push("/login")
        }
    }

    // const [highestBidQuery, setHighestBid] = useState([])
    // useEffect(() => {
    //     db.Auctions.Items.Bids.findHighest(auctionId, id, setHighestBid)
    //     setHighestBid(highestBidQuery[0])
    // }, [id])
    // console.log(highestBidQuery)

    const [category, setCategory] = useState([])
    useEffect(() => db.Categories.listenOne(setCategory, catId), [])

    const [bids, setBids] = useState([])
    useEffect(() => db.Auctions.Items.Bids.listenToOneItemAllBids(auctionId, id, setBids), [id])

    const valid = () => amount > highestBid()

    const [deleteModal, setDeleteModal] = useState(false)

    const [classicModal, setClassicModal] = useState(false)

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
                        <GridItem xs={12} sm={12} md={4} >

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
                                        Category
                    </Primary>
                                    <Info>
                                        {category && category.name}
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
                                {
                                    user && user.id != sellerUserId && auctionId &&
                                    <CardFooter className={classes.cardFooter}>
                                        <Button color="primary" size="lg" onClick={() => setClassicModal(true)}>
                                            Bid
                                        </Button>
                                        <Button color="primary" size="lg" onClick={handleExpandClick}>
                                            View Comments
                                    </Button>
                                    </CardFooter>
                                }
                                {
                                    user && (user.id == sellerUserId || user.role == 'admin') && auctionId &&
                                    <>
                                        <CardFooter className={classes.cardFooter}>
                                            <Button color="primary" size="sm" onClick={() => setEditForm(true)}>
                                                Edit
                                    </Button>
                                            <Button color="danger" size="sm" onClick={() => confirmDelete()}>
                                                Remove
                                    </Button>
                                            <Button color="primary" size="lg" onClick={handleExpandClick}>
                                                View Comments
                                    </Button>
                                        </CardFooter>
                                    </>
                                }

                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <CardContent>
                                        {comments.length > 0
                                            ? comments.map(comment =>
                                                <Comment key={comment.id} auctionId={auctionId} itemId={id} {...comment} />)
                                            : <Info>No questions found, be the first to leave one!</Info>}
                                        <TextField
                                            label="Ask a Question"
                                            multiline
                                            rows={1}
                                            rowsMax={Number.MAX_SAFE_INTEGER}
                                            value={comment}
                                            onChange={(event) => setComment(event.target.value)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment>
                                                        <IconButton color="primary" onClick={addComment}>
                                                            <SendIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />

                                    </CardContent>
                                </Collapse>
                            </Card>

                        </GridItem>
                    </>
                    :
                    <>
                        <ItemForm auctionId={auctionId} setView={setEditForm} editObject={{ id, name, description, picture, catId }} />
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
                <DialogContent>
                </DialogContent>
                <DialogContent
                    id="classic-modal-slide-description"
                    className={classes.modalBody}
                >
                    Delete {name}?
                </DialogContent>
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
                    <h4 className={classes.modalTitle}>Bid on Item</h4>
                </DialogTitle>
                <DialogContent
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

                </DialogActions>
            </Dialog>
        </>

    )
}