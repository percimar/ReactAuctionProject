import fb from '../fb'
import "firebase/storage"
import db from '../db'
import React, { useContext } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardFooter from "../components/Card/CardFooter.js";
import styles from "../assets/jss/material-kit-react/views/landingPageSections/teamStyle.js";
import image from "../assets/img/bg7.jpg";
import AddIcon from "@material-ui/icons/Add";
import { Fab } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function Profile() {

  const { user } = useContext(UserContext)

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
    <div
      className={classes.pageHeader}
      style={{
        backgroundImage: "url(" + image + ")",
        backgroundSize: "cover",
        backgroundPosition: "top center"
      }}
    >
      <div className={classes.section}>
        <h2 className={classes.title}>{user.name}'s Profile</h2>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={4}>
              <Card plain>
                <h4 className={classes.cardTitle}>
                  <img src={user.avatar} alt="avatar" style={{ height: 100, width: 100 }} />
                </h4>
                <CardBody>
                  <p className={classes.description}>
                    {user.name}
                    <br />
                    <small className={classes.smallTitle}>Role: {user.role}</small>
                  </p>
                </CardBody>
                <CardFooter className={classes.justifyCenter}>
                  <label htmlFor="upload-photo">
                    <input
                      style={{ display: "none" }}
                      id="upload-photo"
                      name="upload-photo"
                      type="file"
                      onChange={uploadAvatar}
                    />
                    <Fab color="primary" size="small" component="span" aria-label="add">
                      <AddIcon />
                    </Fab>
                  </label>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
