import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "../components/CustomButtons/Button.js";
import styles from "../assets/jss/material-kit-react/components/headerLinksStyle.js";
import UserContext from '../UserContext'
const useStyles = makeStyles(styles);

export default function HeaderLinksLeft() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  return (

    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          component={Link}
          to="/faqs"
        >
          FAQs
        </Button>
      </ListItem>

      {/* {user
        &&
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            component={Link}
            to="/bugs"
          >
            Report a Bug
        </Button>
        </ListItem>
      } */}

      {
        user &&
        user.role === "admin"
        &&
        <>
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/admin"
            >
              Admin Dashboard
          </Button>
          </ListItem>
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/logs"
            >
              Site Logs
          </Button>
          </ListItem>
        </>
      }
    </List>
  );
}
