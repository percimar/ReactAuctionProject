import defaultAvatar from "../assets/img/defaultAvatar.png"
import fb from '../fb'
import "firebase/storage"
import db from '../db'
import React, { useContext, useState, useEffect, useParams } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Parallax from "../components/Parallax/Parallax.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardBody.js";
import CardFooter from "../components/Card/CardFooter.js";
import Footer from "../components/Footer/Footer.js";
import styles from "../assets/jss/material-kit-react/views/profilePage.js";
import image from "../assets/img/bg8.jpg";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Button } from "@material-ui/core";
import InfoArea from "../components/InfoArea/InfoArea.js";
import Info from "@material-ui/icons/Info";


const useStyles = makeStyles(styles);

export default function Profile() {

  const { loggedInUser } = useContext(UserContext)

  let { userId } = useParams();

  const [user, setUser] = useState("");
  useEffect(() => {
    userId
      ? db.Users.listenOne(setUser, userId)
      : setUser(loggedInUser)
  }, [userId])

  const [userAvatar, setUserAvatar] = useState(user.avatar)
  const [reviews, setReviews] = useState([])
  //useEffect(() => db.Users.Reviews.listenReviewsForUser(setReviews, userId), [])

  const classes = useStyles();
  // add user image 
  const uploadAvatar = async event => {
    const filenameRef = fb.storage().ref().child(`avatars/${user.id}`)
    if (user.avatar) {
      await filenameRef.delete();
    }
    const snapshot = await filenameRef.put(event.target.files[0])
    // put file url in user object and upload to db
    user.avatar = await snapshot.ref.getDownloadURL()
    await db.Users.update(user)
    setUserAvatar(user.avatar)
  }

  return (
    <div>
      <Parallax small filter image={image} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <div>
              <br />
              <input
                style={{ display: "none" }}
                accept="image/*"
                className={classes.input}
                id="upload-photo"
                name="upload-photo"
                type="file"
                onChange={uploadAvatar}
              />

            </div>
            <div style={{ width: "30%" }}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>

                  <Card style={{ width: "10rem" }} >
                    <div style={{ margin: "50" }}>
                      <img
                        style={{ height: "", width: "100%", display: "block" }}
                        className={classes.imgCardTop}
                        src={userAvatar ? userAvatar : defaultAvatar} alt="..." className={classNames(
                          classes.imgRaised,
                          classes.imgFluid
                        )}
                        alt="Card-img-cap"
                      />
                    </div>
                    <CardBody>
                      <div style={{ textAlign: "center" }}>
                        <label htmlFor="upload-photo">
                          <Button variant="outlined" color="default" component="span">
                            <h6>Upload Avatar Photo</h6>
                          </Button>
                        </label>
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <Card style={{ width: "35rem", height: "auto" }} >
                    <CardBody>
                      <div style={{ textAlign: "center" }}>
                        <h5 className={classes.title}>Username: {user.name}</h5>
                        <h6>Role: {user.role.toUpperCase()}</h6>
                      </div>
                    </CardBody>
                  </Card>
                  <Card style={{ textAlign: "center", width: "35rem", height: "auto" }} >
                    <CardHeader className={classes.title}>
                      Reviews
                    </CardHeader>
                    <CardBody>
                      {/* <div style={{ textAlign: "center" }}>
                        {reviews.length > 0
                          ? reviews.map(review =>
                            <Review key={review.id} userId={userId} {...review} />)
                          : <Info>No reviews found, be the first to leave one!</Info>}
                      </div> */}
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
}
