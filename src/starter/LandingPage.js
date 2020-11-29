import React from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "../components/Footer/Footer.js";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Parallax from "../components/Parallax/Parallax.js";
import styles from "../assets/jss/material-kit-react/views/landingPage.js";
import Auctions from "./Auctions.js";
import image from "../assets/img/bg8.jpg";

const useStyles = makeStyles(styles);

export default function LandingPage() {
  const classes = useStyles();
  return (
    <div>
      <Parallax filter image={image}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>MOTORMOB</h1>
              <h4>
              Where timing matters
              </h4>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <Auctions />
        </div>
      </div>
      <Footer />
    </div>
  );
}
