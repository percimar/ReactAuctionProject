import React, { useState, useEffect, useContext } from "react";
import db from '../db'
import UserContext from '../UserContext'
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import CustomInput from "../components/CustomInput/CustomInput.js";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField'
import Datetime from "react-datetime";

const useStyles = makeStyles(styles);

export default function CategoryForm({ editObject, open }) {

    if (editObject) {
        useEffect(() => prepareEdit(editObject), [])
    }

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();
    const [itemId, setItemId] = useState("")
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const valid = () =>
        name !== "" &&
        description !== ""

    const create = () => {
        db.Categories.create({ name, description })
        open(false)
    }

    const prepareEdit = (object) => {
        setItemId(object.id)
        setName(object.name)
        setDescription(object.description)
    }

    const update = () => {
        db.Categories.update({ id: itemId, name, description })
        open(false)
    }

    return (
        <GridItem xs={12} sm={12} md={4}>
            <Card className={classes[cardAnimaton]}>
                <CardHeader color="primary" className={classes.cardHeader}>
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
                    {/* <TextField onChange={event => setName(event.target.value)} label='Name' value={name}>Category</TextField>
                    <TextField onChange={event => setDescription(event.target.value)} label='Description' value={description}>Description</TextField> */}
                </CardBody>
                <CardFooter>
                    {
                        !editObject ?
                            <Button color="primary" size="lg" disabled={!valid()} onClick={create}>
                                Add Category
                    </Button>
                            :
                            <>
                                <Button color="primary" size="lg" onClick={update}>
                                    Save Changes
                            </Button>
                                <br />
                                <Button color="primary" size="lg" onClick={() => open(false)}>
                                    Cancel
                            </Button>
                            </>
                    }

                </CardFooter>
            </Card>
        </GridItem>
    )
}