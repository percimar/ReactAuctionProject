import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import AuctionDetails from './Carlos/AuctionDetails'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Auction from './Auction'
import Button from '@material-ui/core/Button'
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function Auctions() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [auctions, setAuctions] = useState([])
  useEffect(() => db.Auctions.listenToUnfinished(setAuctions), [user])

  const [selectAuction, setSelectAuction] = useState('')

  return (
    <div className={classes.section}>
      {
        !selectAuction ?
          <>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8}>
                <h2 className={classes.title}>Current Auctions</h2>
                {
                  user && user.role === 'admin' &&
                    <Button simple color="primary" size="lg">Add Auction</Button>
                }

              </GridItem>
            </GridContainer>
            <GridContainer>
              {
                auctions.map(auction =>
                  <Auction key={auction.id} set={setSelectAuction} {...auction} />
                )
              }
            </GridContainer>
          </>
          :
          <>
            <AuctionDetails set={setSelectAuction} id={selectAuction}/>
          </>
      }

    </div>
  )
}
