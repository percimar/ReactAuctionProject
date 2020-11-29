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
import image from "../assets/img/bg8.jpg";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Button } from "@material-ui/core";
import InfoArea from "../components/InfoArea/InfoArea.js";
import Info from "@material-ui/icons/Info";


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

            </div>
            <div style={{ width: "30%" }}>
              <GridContainer justify="space-evenly">
                <GridItem xs={12} sm={12} md={6}>

                  {/* <div className={classes.profile} >
                    <div>
                      <img src={user.avatar ? user.avatar : defaultAvatar} alt="..." className={classNames(
                        classes.imgRaised,
                        classes.imgFluid
                      )}
                      //style={{ width: 128, height: 128 }} 
                      />
                    </div>

                    <div>
                      <label htmlFor="upload-photo">
                        <Button variant="outlined" color="default" component="span">
                          Upload Avatar Photo
                       </Button>
                      </label>
                    </div>

                    <div className={classes.name}>
                      <h3 className={classes.title}>{user.name}</h3>
                      <h6>{user.role.toUpperCase()}</h6>
                    </div>
                  </div> */}

                  <Card style={{ width: "10rem" }} >
                    <div style={{ margin: "50" }}>
                      <img
                        style={{ height: "", width: "100%", display: "block" }}
                        className={classes.imgCardTop}
                        src={user.avatar ? user.avatar : defaultAvatar} alt="..." className={classNames(
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
