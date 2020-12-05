import defaultAvatar from "../assets/img/defaultAvatar.png"
import fb from '../fb'
import "firebase/storage"
import db from '../db'
import React, { useContext, useState, useEffect } from "react";
import SendIcon from '@material-ui/icons/Send';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from '@material-ui/core/TextField';
import { useParams } from "react-router-dom";
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
import Review from '../Asmar/Review'
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { ThumbsUpDown } from "@material-ui/icons";


const useStyles = makeStyles(styles);

export default function Profile() {

  const { user } = useContext(UserContext)

  let { userId } = useParams();

  const [profileUser, setProfileUser] = useState("");
  useEffect(() => {
    userId
      ? db.Users.listenOne(setProfileUser, userId)
      : setProfileUser(user)
  }, [])

  const [userAvatar, setUserAvatar] = useState(profileUser.avatar)
  const [reviews, setReviews] = useState([])
  useEffect(() => db.Users.Reviews.listenReviewsForUser(setReviews, userId), [])

  const [reviewText, setReviewText] = useState("")
  const [rating, setRating] = useState(true)

  const classes = useStyles();
  // add profileUser image 
  const uploadAvatar = async event => {
    const filenameRef = fb.storage().ref().child(`avatars/${profileUser.id}`)
    if (profileUser.avatar) {
      await filenameRef.delete();
    }
    const snapshot = await filenameRef.put(event.target.files[0])
    // put file url in profileUser object and upload to db
    profileUser.avatar = await snapshot.ref.getDownloadURL()
    await db.Users.update(profileUser)
    setUserAvatar(profileUser.avatar)
  }

  const addReview = () => {
    if (reviewText) {
      db.Users.Reviews.addReview(profileUser.id, { rating, review: reviewText, timestamp: new Date(), buyerUserId: user.id })
      db.Users.Notifications.sendNotification(profileUser.id,
        {
          title: `A question was asked about ${name}`,
          description: `${user.name} wants to know ${review}`,
          link: `/auctions/items/${auctionId}`
        });
      setReview("");
    }
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
                        <h5 className={classes.title}>Username: {profileUser.name}</h5>
                        <h6>Role: {profileUser.role?.toUpperCase()}</h6>
                      </div>
                    </CardBody>
                  </Card>
                  <Card style={{ textAlign: "center", width: "35rem", height: "auto" }} >
                    <CardHeader className={classes.title}>
                      Reviews
                    </CardHeader>
                    <CardBody>
                      <div style={{ textAlign: "left" }}>
                        {reviews.length > 0
                          ? reviews.map(review =>
                            <Review key={review.id} userId={userId} {...review} />)
                          : <Info>No reviews found, be the first to leave one!</Info>}
                      </div>
                      <hr />
                      {
                        user &&
                        profileUser.id !== user.id &&
                        <>
                          <IconButton onClick={() => setRating(!rating)}>
                            {
                              rating
                                ? <ThumbUpIcon />
                                : <ThumbDownIcon />
                            }
                          </IconButton>
                          <TextField
                            label="Leave a Review"
                            value={reviewText}
                            onChange={(event) => setReviewText(event.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment>
                                  <IconButton color="primary" onClick={addReview}>
                                    <SendIcon />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                          />
                        </>
                      }
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
