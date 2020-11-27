import defaultAvatar from "../assets/img/defaultAvatar.png"
import fb from '../fb'
import "firebase/storage"
import db from '../db'
import React, { useContext } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Parallax from "../components/Parallax/Parallax.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardFooter from "../components/Card/CardFooter.js";
import Footer from "../components/Footer/Footer.js";
import styles from "../assets/jss/material-kit-react/views/profilePage.js";
import image from "../assets/img/bg7.jpg";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function Profile() {

  const { user } = useContext(UserContext)
  console.log(user.avatar)
  const classes = useStyles();
  // add user image 
  const uploadAvatar = async event => {
    const filenameRef = fb.storage().ref().child(`avatars/${user.id}`)
    const snapshot = await filenameRef.put(event.target.files[0])
    // put file url in user object and upload to db
    user.avatar = await snapshot.ref.getDownloadURL()
    await db.Users.update(user)
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
              <label htmlFor="upload-photo">
                <Button variant="contained" color="primary" component="span">
                  Upload Avatar Photo
                </Button>
              </label>
            </div>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div>
                    <img src={user.avatar ? user.avatar : defaultAvatar} alt="..." className={classNames(
                      classes.imgRaised,
                      classes.imgFluid
                    )}
                    //style={{ width: 128, height: 128 }} 
                    />
                  </div>
                  <div className={classes.name}>
                    <h3 className={classes.title}>{user.name}</h3>
                    <h6>{user.role.toUpperCase()}</h6>
                  </div>
                </div>
              </GridItem>
            </GridContainer>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
