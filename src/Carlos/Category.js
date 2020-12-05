
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
import CategoryForm from './CategoryForm'
import { useHistory } from 'react-router-dom';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

const useStyles = makeStyles(styles);

export default function Category({ set, category, id, description, name }) {

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

    const history = useHistory()

    const [editForm, setEditForm] = useState(false)

    const [deleting, setDeleting] = useState(false)

    const editCategory = () => {
        setEditForm(!editForm)
    }

    const confirmDelete = () => {
        setDeleteModal(true)
    }

    const deleteCategory = async (id) => {
        //disable buttons during deleting process
        setDeleting(true)
        // add map that removes items in auction
        let auctions = await db.Auctions.findAll()
        auctions.map(async (auction) => {
            let items = await db.Auctions.Items.findByCategory(auction.id, id)
            items.map(async item => await db.Auctions.Items.updateItem(auction.id, {...item, catId: ''}))
        })
        //remove item and close modal
        db.Categories.remove(id)
        setDeleteModal(false)
    }


    return (
        <>
            {
                !editForm ?
                    <>
                        <GridItem xs={12} sm={12} md={4}>
                            <Card className={classes[cardAnimaton]}>
                                <CardHeader color="primary" className={classes.cardHeader}>
                                    {/* <img src={picture} alt="item" style={{ width: '100px', height: '100px ' }} /> */}
                                </CardHeader>
                                <CardBody>
                                    <Primary>
                                        Category
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
                                </CardBody>
                                <CardFooter className={classes.cardFooter}>
                                    <Button color="primary" size="sm" onClick={() => set(id, name)}>
                                        Set Category
                            </Button>
                                    <br />
                                    {
                                        user && user.role!='user' &&
                                        <>
                                            <Button color="primary" size="sm" onClick={() => editCategory(id)}>
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
                            disableBackdropClick={deleting}
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
                                    disabled={deleting}
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
                                Delete {name}? <br/>
                                All items with this category will have no category
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
                                    onClick={() => deleteCategory(id)}
                                    disabled={deleting}
                                    color="danger"
                                    simple
                                >
                                    Delete
                        </Button>
                                <Button color="transparent" simple disabled={deleting} onClick={() => setDeleteModal(false)}>
                                    Cancel
                        </Button>

                            </DialogActions>
                        </Dialog>
                    </>
                    :
                    <CategoryForm editObject={{ id, name, description }} open={setEditForm} />
            }
        </>
    )
}