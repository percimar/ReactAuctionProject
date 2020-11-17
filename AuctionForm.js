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
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Datetime from "react-datetime";

const useStyles = makeStyles(styles);

export default function AuctionForm() {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [itemId, setItemId] = useState("")
    const [start, setStart] = useState(new Date())
    const [finish, setFinish] = useState(new Date())

    const [items, setItems] = useState([])
    useEffect(() => db.Users.listenToUserItems(setItems, user.id), [user.id])

    const valid = () =>
        itemId !== "" &&
        start >= new Date() &&
        finish > start

    const create = () =>
        db.Auctions.create({ sellerId: user.id, itemId, buyerId: "", name: itemId, start, finish, status: "" })

    return (
        <GridItem xs={12} sm={12} md={4}>
            <Card className={classes[cardAnimaton]}>
                <CardHeader color="primary" className={classes.cardHeader}>

                </CardHeader>
                <CardBody>
                    <FormControl>
                        <InputLabel id="itemId">Item</InputLabel>
                        <Select
                            labelId="itemId"
                            id="itemId"
                            value={itemId}
                            onChange={event => setItemId(event.target.value)}
                        >
                            {
                                items.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                    <br/>
                    <FormControl>
                        <Datetime
                            value={start}
                            onChange={date => setStart(date.toDate())}
                            inputProps={{
                                placeholder: "Start Auction"
                            }}
                        />
                    </FormControl>
                    <FormControl>
                        <Datetime
                            value={finish}
                            onChange={date => setFinish(date.toDate())}
                            inputProps={{
                                placeholder: "Finish Auction"
                            }}
                        />
                    </FormControl>
                </CardBody>
                <CardFooter>
                    <Button simple color="primary" size="lg" disabled={!valid()} onClick={create}>
                        Add Auction
                    </Button>
                </CardFooter>
            </Card>
        </GridItem>
    )
}