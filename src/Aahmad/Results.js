import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import Search from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomInput from "../components/CustomInput/CustomInput.js";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Result from './Result'
import AuctionForm from '../starter/AuctionForm'
import styles from "../assets/jss/material-kit-react/views/landingPage.js";
import Parallax from "../components/Parallax/Parallax.js";
import image from "../assets/img/bg8.jpg";


const useStyles = makeStyles(styles);

export default function Results() {

    const { user } = useContext(UserContext)

    const classes = useStyles();

    const [auctions, setAuctions] = useState([])

    const [selectAuction, setSelectAuction] = useState('')

    const [searchText, setSearchText] = useState("");

    const [categories, setCategories] = useState([])
    useEffect(() => db.Categories.listenAll(setCategories), [user])

    const [categoryId, setCategoryId] = useState('')

    useEffect(() =>
        searchText
            ? db.Auctions.listenToFinishedFiltered(setAuctions, searchText)
            : db.Auctions.listenToFinished(setAuctions)
        , [categoryId, user, searchText])


    const [viewCategory, setViewCategory] = useState(false)

    const selectNewCategory = (catId, name) => {
        if (catId === '') {
            db.Auctions.listenToFinished(setAuctions)
        }
        setCategoryId(catId)
        setViewCategory(false)
        setCategoryName(name)
    }

    // const [addAuction, setAddAuction] = useState(false)

    const [auctionsWithCat, setAuctionsWithCat] = useState([])

    useEffect(() => {
        setAuctionsWithCat([])
        auctions.map(auction => db.Auctions.Items.listenWithCategory(setAuctionsWithCat, auctionsWithCat, categoryId, auction.id))
        // db.Auctions.Items.getItemsWithCategory('aZ9GtJthtYn2Id0p1Ab2', 'X54I5YSOuNkcWuimFrzc', setAuctionsWithCat, auctionsWithCat)
    }, [categoryId])

    useEffect(() => {
        if (auctionsWithCat.length > 0) {
            db.Auctions.listenByCategory(setAuctions, auctionsWithCat)
        }
    }, [auctionsWithCat])

    return (
        <>

            <Parallax filter image={image}>
                <div className={classes.container}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <h1 className={classes.title}>Results</h1>
                        </GridItem>
                    </GridContainer>
                </div>
            </Parallax>

            <div className={classes.section}>
                {
                    !viewCategory ?
                        !selectAuction ?
                            <>
                                <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={8}>
                                        <h2 className={classes.title}>Auction Results</h2>
                                        <CustomInput
                                            onChange={event => setSearchText(event.target.value)}
                                            labelText="Search"
                                            placeholder="Search"
                                            id="searchText"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event => setSearchText(event.target.value),
                                                value: searchText,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Search className={classes.inputIconsColor} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer style={{ marginTop: '30px' }}>
                                    {/* {
                                        addAuction &&
                                        <AuctionForm open={setAddAuction} />
                                    } */}
                                    {
                                        auctions ?
                                            auctions.map(auction =>
                                                <Result key={auction.id} set={setSelectAuction} {...auction} />
                                            )
                                            :
                                            <>
                                                <h2 className={classes.title}>Loading Auctions...</h2>
                                            </>
                                    }
                                </GridContainer>
                            </>
                            :
                            <></>
                        :
                        <></>
                }

            </div>
        </>
    )
}
