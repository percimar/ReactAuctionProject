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
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(styles);

export default function UsersItemForm() {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [auctions, setAuctions] = useState([])
    useEffect(() => db.Auctions.listenToUnfinished(setAuctions), [])

    const [categories, setCategories] = useState([])
    useEffect(() => db.Categories.listenAll(setCategories), [])

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [auction, setAuction] = useState([])
    const [category, setCategory] = useState([])

    const valid = () =>
        name !== "" &&
        description !== "" &&
        auction !== "" &&
        category !== ""

    const create = () => {
        db.Auctions.Items.addItem(auction, { name, description, catId: category, sellerUserId: user.id })
    }

    return (
        <GridItem xs={12} sm={12} md={4}>
            <Card className={classes[cardAnimaton]}>
                <CardHeader color="primary" className={classes.cardHeader}>
                    Item Creation Form
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
                    <FormControl className={classes.formControl}>
                        <InputLabel id="auctionselection-label">Available Auctions</InputLabel>
                        <Select
                            native
                            style={{ width: '400px', height: '50px' }}
                            labelId="auctionselection-label"
                            id="auctionselection"
                            value={auction.displayName}
                            onChange={event => setAuction(event.target.value)}
                        >
                            <option aria-label="None" value="" />
                            {
                                auctions.map(item =>
                                    <option key={item.id} value={item.id} onClick={() => console.log("onclick for auction")} >{`${item.displayName}`} </option>
                                )
                            }
                        </Select>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel id="categoryselection-label">Available Categories</InputLabel>
                        <Select
                            native
                            style={{ width: '400px', height: '50px' }}
                            labelId="categoryselection-label"
                            id="categoryselection"
                            value={category.name}
                            onChange={event => setCategory(event.target.value)}>
                            <option aria-label="None" value="" />
                            {
                                categories.map(item =>
                                    < option key={item.id} value={item.id} onClick={() => console.log("onclick for category")} >{`${item.name}`} </option>
                                )
                            }
                        </Select>
                    </FormControl>

                </CardBody>
                <CardFooter className={classes.cardFooter}>
                    {
                        <Button simple color="primary" size="lg" disabled={!valid()} onClick={create}>
                            Add Item
                        </Button>
                    }

                </CardFooter>
            </Card>
        </GridItem >
    )
}