//Carlos: Added search by category

import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import AuctionDetails from '../Carlos/AuctionDetails'
import { makeStyles } from "@material-ui/core/styles";
import Search from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import CustomInput from "../components/CustomInput/CustomInput.js";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Auction from './Auction'
import AuctionForm from './AuctionForm'
import Category from '../Carlos/Category'
import CategoryForm from '../Carlos/CategoryForm'
import Button from '@material-ui/core/Button'
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";
import { useHistory, Link } from 'react-router-dom';


const useStyles = makeStyles(styles);


export default function Auctions() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [auctions, setAuctions] = useState([])

  const [selectAuction, setSelectAuction] = useState('')

  const [searchText, setSearchText] = useState("");

  const [categories, setCategories] = useState([])
  useEffect(() => db.Categories.listenAll(setCategories), [user])

  const [categoryId, setCategoryId] = useState('')


  // useEffect(() =>
  //   searchText
  //     ? db.Auctions.listenToUnfinishedFiltered(setAuctions, searchText)
  //     : selectNewCategory(categoryId, categoryName)
  //   , [categoryId, user, searchText])

  useEffect(() =>
    searchText
      ? prepareSearch()
      : selectNewCategory(categoryId, categoryName)
    , [categoryId, user, searchText])


  const prepareSearch = () => {
    selectNewCategory('', '')
    db.Auctions.listenToUnfinishedFiltered(setAuctions, searchText)
  }

  const [categoryName, setCategoryName] = useState('')

  const [viewCategory, setViewCategory] = useState(false)

  const selectNewCategory = (catId, name) => {
    if (catId === '' && searchText == '') {
      db.Auctions.listenToUnfinished(setAuctions)
    }
    setCategoryId(catId)
    setViewCategory(false)
    setCategoryName(name)
  }

  const [addAuction, setAddAuction] = useState(false)

  const [addCategory, setAddCategory] = useState(false)

  const [auctionsWithCat, setAuctionsWithCat] = useState([])

  useEffect(() => {
    //reset auctions with cat
    setAuctionsWithCat([])
    //for each auction, find items with a certain category. If items are found, auctionId is added to auctionsWithCat
    auctions.map(auction => db.Auctions.Items.listenWithCategory(setAuctionsWithCat, auctionsWithCat, categoryId, auction.id))
    console.log(auctionsWithCat)
  }, [categoryId])

  useEffect(() => {
    if (auctionsWithCat.length > 0) {
      //go through each auction and find every auction with its id in the array
      db.Auctions.listenByCategory(setAuctions, auctionsWithCat)
    }
    else if (auctionsWithCat.length <= 0) {
      setAuctions([])
    }
  }, [auctionsWithCat])

  return (
    <div className={classes.section}>
      {
        !viewCategory ?
          !selectAuction ?
            <>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <h2 className={classes.title}>Current Auctions</h2>
                  <CustomInput
                    onChange={event => setSearchText(event.target.value)}
                    labelText="Search All Auctions"
                    placeholder="Search All Auctions"
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
                  {
                    categoryName &&
                    <>
                      <h3 className={classes.description}>Category: {categoryName}</h3>
                    </>
                  }
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                  {
                    categoryId &&
                    <>
                      <Button simple='true' color="primary" size="large" onClick={() => selectNewCategory('', '')}>View All Auctions</Button>
                    </>
                  }
                  {
                    categoryId == '' &&
                    <Button simple='true' color="primary" size="large" onClick={() => setViewCategory(!viewCategory)}>View Auctions By Category</Button>
                  }
                  {
                    user && user.role!='user' && !categoryId &&
                    <Button simple='true' color="primary" size="large" onClick={() => setAddAuction(!addAuction)}>Add Auction</Button>
                  }
                </GridItem>
              </GridContainer>
              <GridContainer style={{ marginTop: '30px' }}>
                {
                  addAuction &&
                  <AuctionForm open={setAddAuction} />
                }
                {
                  auctions.length > 0 ?
                    auctions.map(auction =>
                      <Auction key={auction.id} set={setSelectAuction} {...auction} />
                    )
                    :
                    <>
                      <GridItem>
                        <h2 className={classes.title}>Auctions Not Found</h2>
                      </GridItem>

                    </>
                }
              </GridContainer>
            </>
            :
            <>
              <AuctionDetails set={setSelectAuction} id={selectAuction} />
            </>
          :
          <>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>

                <h2 className={classes.title}>Current Auctions</h2>
                <br /><br />

                <h2 className={classes.title}>Categories</h2>
                {
                  categoryName &&
                  <>
                    <h3 className={classes.description}>Selected Category: {categoryName}</h3>
                  </>
                }
              </GridItem>
              <GridItem xs={12} sm={12} md={8}>
                <Button simple='true' color="primary" size="large" onClick={() => setViewCategory(!viewCategory)}>View Auctions</Button>
                {
                  user && user.role!='user' &&
                  <Button simple="true" color="primary" size="large" onClick={() => setAddCategory(!addCategory)}>Add Category</Button>
                }
              </GridItem>
            </GridContainer>
            <GridContainer style={{ marginTop: '30px' }}>
              {
                addCategory &&
                <CategoryForm open={setAddCategory} />
              }
              {
                categories.map(category =>
                  <Category key={category.id} set={selectNewCategory} category={category} {...category}></Category>
                )
              }
            </GridContainer>
          </>
      }

    </div>
  )
}
