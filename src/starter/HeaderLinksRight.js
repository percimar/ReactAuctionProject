import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "../components/CustomButtons/Button.js";
import styles from "../assets/jss/material-kit-react/components/headerLinksStyle.js";
import UserContext from '../UserContext'
import NotificationsBar from './NotificationsBar'
import db from '../db'
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.js';

const useStyles = makeStyles(styles);

export default function HeaderLinksRight() {

  const { user } = useContext(UserContext)

  const classes = useStyles();
  return (

    <>
      {
        user
        &&
        user.role === "user"
        &&
        <CustomDropdown
          hoverColor="black"
          buttonText={user.name}
          dropdownList={[
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/useritems"
            >
              My Items
          </Button>
            ,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/profile"
            >
              Profile
          </Button>
            ,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/following"
            >
              Following
          </Button>,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/notifications"
            >
              Notifications
          </Button>,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/results"
            >
              Results
        </Button>,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/logout"
            >
              Log Out
            </Button>
          ]
          }
        />
      }
      {
        user
        &&
        (user.role === "admin" || user.role === "moderator")
        &&
        <CustomDropdown
          hoverColor="black"
          buttonText={user.name}
          dropdownList={[
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/useritems"
            >
              My Items
          </Button>
            ,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/userauctions"
            >
              Auctions
          </Button>
            ,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/profile"
            >
              Profile
          </Button>
            ,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/following"
            >
              Following
          </Button>,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/notifications"
            >
              Notifications
          </Button>,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/results"
            >
              Results
        </Button>,
            <Button
              style={{ maxWidth: '180px', maxHeight: '30px', minWidth: '180px', minHeight: '30px', textAlign: "center" }}
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/logout"
            >
              Log Out 
            </Button>
          ]
          }
        />
      }


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
          !user
          &&
          <ListItem className={classes.listItem}>
            <Button
              color="transparent"
              className={classes.navLink}
              component={Link}
              to="/results"
            >
              Results
        </Button>
          </ListItem>
        }

        {/* {
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
        } */}

      </List >

    </>
  );
}
