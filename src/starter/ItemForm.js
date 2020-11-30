import React, { useState, useContext, useEffect } from "react";
import db from '../db'
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import CustomInput from "../components/CustomInput/CustomInput.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'

const useStyles = makeStyles(styles);

export default function ItemForm({auctionId, setView, editObject}) {

    if (editObject) {
        console.log(editObject)
        useEffect(() => prepareEdit(editObject), [])
    }

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    
    const [id, setId] = useState('')
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [picture, setPicture] = useState("")

    const valid = () =>
        name !== "" &&
        description !== "" &&
        picture !== ""

    const create = () => {
        // db.Users.createUserItem(userId, { name, description, picture })
        db.Auctions.Items.addItem(auctionId, {name, description, picture, catId: 'X54I5YSOuNkcWuimFrzc', sellerUserId: user.id})
        setView(false)
    }

    const prepareEdit = (object) => {
        setId(object.id)
        setName(object.name)
        setDescription(object.description)
        setPicture(object.picture)
    }

    const edit = () => {
        db.Auctions.Items.updateItem(auctionId, { id, name, description, picture })
        setView(false)
    }

    

    return (
        <GridItem xs={12} sm={12} md={4}>
            <Card className={classes[cardAnimaton]}>
                <CardHeader color="primary" className={classes.cardHeader}>
                    Image goes here
                </CardHeader>
                <CardBody>
                    <CustomInput
                        labelText="Name"
                        id="name"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            onChange: event => setName(event.target.value),
                            value: name,
                            type: "text"
                        }}
                    />
                    <CustomInput
                        labelText="Description"
                        id="description"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            onChange: event => setDescription(event.target.value),
                            value: description,
                            type: "text",
                            multiline: true,
                            rows: 5
                        }}
                    />

                    <CustomInput
                        labelText="Picture"
                        id="picture"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            onChange: event => setPicture(event.target.value),
                            value: picture,
                            type: "text"
                        }}
                    />
                </CardBody>
                <CardFooter className={classes.cardFooter}>
                    {
                        !editObject ? 
                        <Button simple color="primary" size="lg" disabled={!valid()} onClick={create}>
                            Add Item
                        </Button>
                        :
                        <>
                        <Button simple color="primary" size="lg" disabled={!valid()} onClick={edit}>
                            Save Changes
                        </Button>
                        <Button simple color="primary" size="lg" onClick={() => open(false)}>
                            Cancel
                        </Button>
                        </>
                    }
                    
                </CardFooter>
            </Card>
        </GridItem>
    )
}