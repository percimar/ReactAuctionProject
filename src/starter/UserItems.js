import db from '../db'
import React, { useState, useEffect, useContext } from "react";
import UserContext from '../UserContext'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Item from './Item'
import ItemForm from './ItemForm'
import image from "../assets/img/bg8.jpg";
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function UserItems() {

  const { user } = useContext(UserContext)

  const classes = useStyles();

  const [items, setItems] = useState([])
  useEffect(() => db.Users.listenToUserItems(setItems, user.id), [user.id])

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
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={8}>
            <h2 className={classes.title}>My Items</h2>
          </GridItem>
        </GridContainer>
        <GridContainer>
          {
            items.map(item =>
              <Item key={item.id} userId={user.id} {...item} />
            )
          }
          <ItemForm userId={user.id} />
        </GridContainer>
      </div>
    </div>
  )
}
