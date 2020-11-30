//Carlos: Added search by category

import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import AuctionDetails from '../Carlos/AuctionDetails'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Auction from './Auction'
import AuctionForm from './AuctionForm'
import Category from '../Carlos/Category'
import CategoryForm from '../Carlos/CategoryForm'
import Button from '@material-ui/core/Button'
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function Auctions() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [auctions, setAuctions] = useState([])
  useEffect(() => db.Auctions.listenToUnfinished(setAuctions), [categoryId, user])

  const [selectAuction, setSelectAuction] = useState('')

  const [categories, setCategories] = useState([])
  useEffect(() => db.Categories.listenAll(setCategories), [user])

  const [categoryId, setCategoryId] = useState('')

  const [categoryName, setCategoryName] = useState('')

  const [viewCategory, setViewCategory] = useState(false)

  const selectNewCategory = (catId, name) => {
    if (catId === '') {
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
    <div className={classes.section}>
      {
        !viewCategory ?
          !selectAuction ?
            <>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={8}>
                  <h2 className={classes.title}>Current Auctions</h2>
                  {
                    categoryName &&
                    <>
                      <h3 className={classes.description}>{categoryName}</h3>
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
                    user && user.role === 'admin' && !categoryId &&
                    <Button simple='true' color="primary" size="large" onClick={() => setAddAuction(!addAuction)}>Add Auction</Button>
                  }
                </GridItem>
              </GridContainer>
              <GridContainer style={{ marginTop: '30px' }}>
                {
                  addAuction &&
                  <AuctionForm open={setAddAuction}/>
                }
                {
                  auctions ?
                    auctions.map(auction =>
                      <Auction key={auction.id} set={setSelectAuction} {...auction} />
                    )
                    :
                    <>
                      <h2 className={classes.title}>Loading Auctions...</h2>
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
                  user && user.role === 'admin' &&
                  <Button simple="true" color="primary" size="large" onClick={() => setAddCategory(!addCategory)}>Add Category</Button>
                }
              </GridItem>
            </GridContainer>
            <GridContainer style={{ marginTop: '30px' }}>
              {
                addCategory &&
                <CategoryForm open={setAddCategory}/>
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
