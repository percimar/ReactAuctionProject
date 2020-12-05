import defaultCar from "../assets/img/defaultCar.jpg"
import React, { useState, useContext, useEffect } from "react";
import db from '../db'
import fb from '../fb'
import "firebase/storage"
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import CustomInput from "../components/CustomInput/CustomInput.js";
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import CustomDropdown from '../components/CustomDropdown/CustomDropdown'
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Primary from "../components/Typography/Primary.js";

const useStyles = makeStyles(styles);

export default function ItemForm({ auctionId, setView, editObject }) {
    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [id, setId] = useState('')
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [picture, setPicture] = useState("");
    const [catId, setCatId] = useState("")
    const [categories, setCategories] = useState([])
    useEffect(() => db.Categories.listenAll(setCategories), [])
    // if(catId) {
    //     useEffect(() => db.Categories.listenOne(setCatId, catId), [])
    // }


    const valid = () =>
        name !== "" &&
        description !== ""

    const create = () => {
        // db.Users.createUserItem(userId, { name, description, picture })
        db.Auctions.Items.addItem(auctionId, { name, description, catId, sellerUserId: user.id })
        db.Logs.create({
            timestamp: new Date(),
            user: user.id,
            username: user.name,
            userroles: user.role,
            collection: "Items",
            action: `Created item ${name}`
        })
        setView(false)
    }

    const prepareEdit = (object) => {
        setId(object.id)
        setName(object.name)
        setDescription(object.description)
        if (object.picture) setPicture(object.picture)
        setCatId(object.catId)
    }

    useEffect(() => {
        if (editObject)
            prepareEdit(editObject)
    }, [])

    const edit = () => {
        db.Auctions.Items.updateItem(auctionId, { id, name, description, picture, catId, sellerUserId: user.id })
        setView(false)
    }

    const uploadPicture = async event => {
        const filenameRef = fb.storage().ref().child(`cars/${id}`)
        if (editObject.picture) {
            await filenameRef.delete();
        }
        const snapshot = await filenameRef.put(event.target.files[0])
        setPicture(await snapshot.ref.getDownloadURL())
    }

    return (
        <GridItem xs={12} sm={12} md={4}>
            <Card className={classes[cardAnimaton]}>
                <CardHeader color="primary" className={classes.cardHeader}>
                    <img src={picture ?? defaultCar} alt="item" style={{ width: '100px', height: '100px' }} />
                    {
                        id &&
                        <>
                            <input
                                style={{ display: "none" }}
                                accept="image/*"
                                className={classes.input}
                                id="upload-picture"
                                name="upload-picture"
                                type="file"
                                onChange={uploadPicture}
                            />
                            <label htmlFor="upload-picture">
                                <IconButton component="span">
                                    <AddAPhotoIcon />
                                </IconButton>
                            </label>
                        </>
                    }


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
                    <Primary>Category</Primary>
                    <FormControl fullWidth margin="normal" variant="outlined" className={classes.formControl}>
                        <Select
                            displayEmpty
                            labelId="demo-simple-select-filled-label"
                            id="demo-simple-select-filled"
                            value={catId}
                            onChange={event => setCatId(event.target.value)}
                        >
                            <MenuItem key='none' value=''>No Category</MenuItem>
                            {categories.map(category => <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>)}
                        </Select>
                    </FormControl>


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
                                <Button simple color="primary" size="lg" onClick={() => setView(false)}>
                                    Cancel
                                </Button>
                            </>
                    }

                </CardFooter>
            </Card >
        </GridItem >
    )
}