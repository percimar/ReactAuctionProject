import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Auction from '../starter/Auction'
import Item from '../starter/Item'
import Button from '@material-ui/core/Button'
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function AuctionDetails({ set, id }) {
console.log("AUCTION DETAILS")
  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [auction, setAuction] = useState(null)
  useEffect(() => db.Auctions.listenOne(setAuction, id), [])

  const [items, setItems] = useState([])
  useEffect(() => db.Auctions.Items.listenToOneAuctionAllItems(setItems, id))

  const [Followedauction, setFollowing] = useState(null)
  useEffect(() => db.Users.Following.listenToFollowingByAuction(setFollowing, user.id, id))

  const addfollow = () => {
    db.Users.Following.addFollowing(user.id, { auctionId: id, notifications: false })
  }
  const removefollow = () => {
    db.Users.Following.removeOneFollowing(user.id, Followedauction[0].id)
  }
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <Button simple="true" color="primary" size="large" onClick={() => set(null)}>Back to Auctions</Button>
          {
            Followedauction == null || Followedauction.length == 0 ?
              <>
                <Button simple="true" color="primary" size="large" onClick={() => addfollow()}>Add to Following</Button>
              </> :
              <Button simple="true" color="primary" size="large" onClick={() => removefollow()}>Remove from Following</Button>
          }

          {
            //When auction is loading
            !auction ?
              <h2 className={classes.title}>Loading Auction...</h2> :
              <>
                <h2 className={classes.title}>{auction.displayName}</h2>
                <h3 className={classes.description}>Started {auction.start.toDateString()}</h3>
                <h3 className={classes.description}>Ends {auction.finish.toDateString()}</h3>
              </>
          }
        </GridItem>
      </GridContainer>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          {
            //When auction is loading
            !items ?
              <h2 className={classes.title}>Loading Items...</h2> :
              items.map(item =>
                <Item key={item.id} {...item} />
              )
          }
        </GridItem>
      </GridContainer>
    </div>
  )
}