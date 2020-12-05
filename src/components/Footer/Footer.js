/*eslint-disable*/
import React, { useContext } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// material-ui core components
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UserContext from '../../UserContext'
import Button from "../../components/CustomButtons/Button.js";
import { Link } from "react-router-dom";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import styles from "assets/jss/material-kit-react/components/footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const { user } = useContext(UserContext)
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            {/* <ListItem className={classes.inlineBlock}>
              <a
                href="https://www.creative-tim.com/?ref=mkr-footer"
                className={classes.block}
                target="_blank"
              >
                Creative Tim
              </a>
            </ListItem> */}
            {/* <ListItem className={classes.inlineBlock}>
              <a
                href="https://www.creative-tim.com/presentation?ref=mkr-footer"
                className={classes.block}
                target="_blank"
              >
                About us
              </a>
            </ListItem> */}
            <ListItem className={classes.inlineBlock}>
              <Button
                color="transparent"
                className={classes.navLink}
                component={Link}
                to="/about"
              >
                About
                </Button>
            </ListItem>
            {/* <ListItem className={classes.inlineBlock}>
              <a
                href="http://blog.creative-tim.com/?ref=mkr-footer"
                className={classes.block}
                target="_blank"
              >
                Blog
              </a>
            </ListItem> */}
            {
              user
              &&
              <ListItem className={classes.inlineBlock}>
                <Button
                  color="transparent"
                  className={classes.navLink}
                  component={Link}
                  to="/bugs"
                >
                  Report a Bug
                </Button>
              </ListItem>
            }
            <ListItem className={classes.inlineBlock}>
              <Button
                color="transparent"
                className={classes.navLink}
                component={Link}
                to="/faqs"
              >
                FAQs
                </Button>
            </ListItem>
          </List>
        </div>
        {/* <div className={classes.right}>
          &copy; {1900 + new Date().getYear()} , made with{" "}
          <Favorite className={classes.icon} /> by{" "}
          <a
            href="https://www.creative-tim.com?ref=mkr-footer"
            className={aClasses}
            target="_blank"
          >
            Creative Tim
          </a>{" "}
          for a better web.
        </div> */}
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
