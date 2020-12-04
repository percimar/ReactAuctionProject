import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "../components/CustomButtons/Button.js";
import styles from "../assets/jss/material-kit-react/components/headerLinksStyle.js";
import UserContext from '../UserContext'

const useStyles = makeStyles(styles);

export default function HeaderLinksRight() {

  const { user } = useContext(UserContext)

  const classes = useStyles();
  return (
    <List className={classes.list}>
      {
        !user
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/register"
          >
            Register
        </Button>
        </ListItem>
      }
      {
        !user
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/login"
          >
            Login
        </Button>
        </ListItem>
      }

      {
        user
        &&
        user.role === "user"
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/useritems"
          >
            My Items
          </Button>
        </ListItem>
      }
      {
        user
        &&
        user.role === "user"
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/userauctions"
          >
            My Auctions
          </Button>
        </ListItem>
      }
      {
        user
        &&
        user.role === "user"
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/profile"
          >
            My Profile
          </Button>
        </ListItem>
      }
      {
        user
        &&
        user.role === "user"
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/following"
          >
            My Following
          </Button>
        </ListItem>
      }
      {
        user
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/notifications"
          >
            My Notifications
          </Button>
        </ListItem>
      }
      {
        user
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/logout"
          >
            Logout {user.name}
          </Button>
        </ListItem>
      }

    </List >
  );
}
