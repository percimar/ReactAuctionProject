import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Auction from './Auction'
import AuctionForm from './AuctionForm'
import image from "../assets/img/bg8.jpg";
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function UserAuctions() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [auctions, setAuctions] = useState([])
  useEffect(() => db.Auctions.listenToAuctionsByUser(setAuctions, user.id), [user.id])

  return (
    <div
      className={classes.pageHeader}
      style={{
        backgroundImage: "url(" + image + ")",
        backgroundSize: "cover",
        backgroundPosition: "top center"
      }}
    >
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h2 className={classes.title}>My Auctions</h2>
          </GridItem>
        </GridContainer>
        <GridContainer>
          {
            auctions.map(auction =>
              <Auction key={auction.id} user={user} {...auction} />
            )
          }
          <AuctionForm user={user} />
        </GridContainer>
      </div>
    </div>
  )
}
