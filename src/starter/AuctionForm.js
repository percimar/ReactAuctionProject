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
import TextField from '@material-ui/core/TextField'
import Datetime from "react-datetime";

const useStyles = makeStyles(styles);

export default function AuctionForm({editObject, open}) {

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
    const [title, setTitle] = useState("")
    const [start, setStart] = useState(new Date())
    const [finish, setFinish] = useState(new Date())

    const [items, setItems] = useState([])
    // useEffect(() => db.Users.listenToUserItems(setItems, user.id), [user.id])

    const valid = () =>
        title !== "" &&
        start >= new Date() &&
        finish > start

    const create = () => {
        open(false)
        db.Auctions.create({ displayName: title, start, finish, status: "Ongoing" })
        setTitle('')
        setStart(new Date())
        setFinish(new Date())
    }

    const prepareEdit = (object) => {
        setItemId(object.id)
        setTitle(object.displayName)
        setStart(object.start)
        setFinish(object.finish)
    }

    const update = () => {
        db.Auctions.update({id: itemId, displayName: title, start, finish, status: "Ongoing"})
        console.log(open)
        open(false)
    }

    return (
        <GridItem xs={12} sm={12} md={4}>
            <Card className={classes[cardAnimaton]}>
                <CardHeader color="primary" className={classes.cardHeader}>
                    <TextField onChange={event => setTitle(event.target.value)} label='Name' value={title}>Auction Name</TextField>
                </CardHeader>
                <CardBody>
                    {/* <FormControl>
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
                    </FormControl> */}
                    <br />
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
                <CardFooter className={classes.cardFooter}>
                    <Button color="primary" size="sm" disabled={!valid()} onClick={!editObject ? create : update}>
                        {!editObject ? 'Add Auction' : 'Save Changes'}
                    </Button>
                    {
                        editObject && 
                        <Button color="primary" size="sm" onClick={() => open(false)}>    
                            Close
                        </Button>
                    }
                </CardFooter>
            </Card>
        </GridItem>
    )
}