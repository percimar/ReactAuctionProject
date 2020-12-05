import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Item from './Item'
import UsersItemForm from '../Mahmoud/UsersItemForm'
import Parallax from "../components/Parallax/Parallax.js";
import image from "../assets/img/bg8.jpg";
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function UserItems() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [items, setItems] = useState([])
  // useEffect(() => db.Users.listenToUserItems(setItems, user.id), [user.id])
  useEffect(() => db.Auctions.Items.listenToAllItemsByUser(setItems, user.id), [user.id])

  return (
    <>
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
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h2 className={classes.title}>My Items</h2>
          </GridItem>
        </GridContainer>
        <GridContainer>
          {
            items.map(item =>
              <Item key={item.id} {...item} />
            )
          }
          <UsersItemForm />
        </GridContainer>
        <h3>Please, edit/delete your items in auction page</h3>
      </div>
    </>
  )
}
