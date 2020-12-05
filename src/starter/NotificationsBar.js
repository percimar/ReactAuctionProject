import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "../components/CustomButtons/Button.js";
import styles from "../assets/jss/material-kit-react/components/headerLinksStyle.js";
import UserContext from '../UserContext'
import db from '../db'

const useStyles = makeStyles(styles);

export default function NotificationsBar() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [count, setNotifCount] = useState(0)
  useEffect(() => db.Users.Notifications.listenToUnseenNotificationsCount(setNotifCount, user.id), [])

  // return (
  //       <ListItem className={classes.listItem}>
  //         <Button
  //           color="transparent"
  //           className={classes.navLink}
  //           component={Link}
  //           to="/notifications"
  //         >
  //           My Notifications ({count})
  //         </Button>
  //       </ListItem>
  // );
  return (
    <Button
      style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
      color="transparent"
      className={classes.navLink}
      component={Link}
      to="/notifications"
    >
      Notifications ({count})
      
    </Button>
  );
}
