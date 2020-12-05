import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Auction from './Auction'
import AuctionForm from './AuctionForm'
import image from "../assets/img/bg8.jpg";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import Parallax from "../components/Parallax/Parallax.js";
import classNames from "classnames";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import Footer from "../components/Footer/Footer.js";


const useStyles = makeStyles(styles);

export default function UserAuctions() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [auctions, setAuctions] = useState([])
  useEffect(() => db.Auctions.listenToAuctionsByUser(setAuctions, user.id), [user.id])

  return (
    <>
      {/* <div
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
              <h2 className={classes.title} style={{ color: "white" }}>My Auctions</h2>
            </GridItem>
          </GridContainer>
          <GridContainer justify="center">
            {
              auctions.map(auction =>
                <Auction key={auction.id} user={user} {...auction} />
              )
            }
            <AuctionForm user={user} />
          </GridContainer>
        </div>
      </div> */}

      <div>
        <Parallax filter image={image}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>My Auctions</h1>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>

            <Card style={{}} >
              <br />
              <div style={{ textAlign: "center" }}>
                <h1>Auctions</h1>
                <br />
              </div>
              <CardBody>
                <div style={{ textAlign: "center" }}>
                  <GridContainer justify="center">
                    {
                      auctions.map(auction =>
                        <Auction key={auction.id} user={user} {...auction} />
                      )
                    }
                    <AuctionForm user={user} />
                  </GridContainer>
                </div>
                <br />
              </CardBody>
            </Card>

          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}
