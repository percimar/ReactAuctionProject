import React, { useState, useEffect } from "react";
import db from '../db'
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import styles from "../assets/jss/material-kit-react/views/landingPageSections/productStyle.js";
import landingStyles from "../assets/jss/material-kit-react/views/landingPage"
import image from "../assets/img/bg8.jpg";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Close from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import classNames from "classnames";
import Parallax from "../components/Parallax/Parallax.js";

const useStyles = makeStyles(styles);
const useLandingStyles = makeStyles(landingStyles)

export default function Admin({ id, name, role, avatar }) {

    const grant = () => {
        db.Users.update({ id, name, role: 'moderator', avatar: avatar ? avatar : '' })
        db.Users.Notifications.sendNotification(id, {
            title: 'You are now a moderator!',
            description: 'You have been given moderator privileges by admin'
        })
    }

    const revoke = () => {
        db.Users.update({ id, name, role: 'user', avatar: avatar ? avatar : '' })
        db.Users.Notifications.sendNotification(id, {
            title: 'You are no longer a moderator',
            description: 'Your moderator privileges has been revoked by admin'
        })
    }

    return (
        <>
            <ListItem key={id} button>
                <ListItemAvatar>
                    <Avatar
                        alt={name}
                        src={avatar}
                    />
                </ListItemAvatar>
                <ListItemText id='label' primary={`${name} (${role})`} />
                <ListItemSecondaryAction>
                    <Button size='sm' color='success' disabled={role == 'moderator'} onClick={grant}>Grant</Button>
                    <Button size='sm' color='danger' disabled={role == 'user'} onClick={revoke}>Revoke</Button>
                    {/* <Checkbox
                        edge="end"
                        onChange={() => setChecked(!checked)}
                        checked={checked}
                        inputProps={{ 'aria-labelledby': id }}
                    /> */}
                </ListItemSecondaryAction>
            </ListItem>

        </>
    );
}
