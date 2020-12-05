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


import Carousel from "react-slick";
import LocationOn from "@material-ui/icons/LocationOn";
import Card from "components/Card/Card.js";
import image1 from "assets/img/bg8.jpg";
import image2 from "assets/img/bg9.jpg";
import image3 from "assets/img/bg10.jpg";
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true
};

const useStyles = makeStyles(styles);

export default function LandingPage() {
  const classes = useStyles();

  return (
    < div >
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

      <div className={classNames(classes.main, classes.mainRaised)} >


        <div style={{ marginLeft: "25%" }} >
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <Carousel {...settings}>
                  <div>
                    <img
                      src={image1}
                      alt="First slide"
                      className="slick-image"
                    />
                    <div className="slick-caption">
                      <h4>
                        Ferrari 250 GTO Series II
                      </h4>
                    </div>
                  </div>
                  <div>
                    <img
                      src={image2}
                      alt="Second slide"
                      className="slick-image"
                    />
                    <div className="slick-caption">
                      <h4>
                        Mercedes-Benz 300SL
                     </h4>
                    </div>
                  </div>
                  <div>
                    <img
                      src={image3}
                      alt="Third slide"
                      className="slick-image"
                    />
                    <div className="slick-caption">
                      <h4>
                        Lamborghini Miura
                      </h4>
                    </div>
                  </div>
                </Carousel>
              </Card>
            </GridItem>
          </GridContainer>
        </div>


        <div className={classes.container}>
          <Auctions />
        </div>


      </div>
      <Footer />
    </div >
  );
}
