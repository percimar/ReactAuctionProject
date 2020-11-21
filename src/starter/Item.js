
import React from "react";
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import Info from "../components/Typography/Info.js";
import Primary from "../components/Typography/Primary.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";

const useStyles = makeStyles(styles);

export default function Item({ name, description, picture }) {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    return (
        <GridItem xs={12} sm={12} md={4}>
            
            <Card className={classes[cardAnimaton]}>
                <CardHeader color="primary" className={classes.cardHeader}>
                    <img src={picture} alt="item" style={{ width: '100px', height: '100px ' }} />
                </CardHeader>
                <CardBody>
                    <Primary>
                        Name
                    </Primary>
                    <Info>
                        {name}
                    </Info>
                    <br />
                    <Primary>
                        Description
                    </Primary>
                    <Info>
                        {description}
                    </Info>
                </CardBody>
                <CardFooter className={classes.cardFooter}>
                    {/*show bid if auction did not finish + item is available for bids*/}
                    <Button simple color="primary" size="lg">
                        Bid
                    </Button>
                    {/* Show Edit item for item's owner
                    <Button simple color="primary" size="lg">
                        Edit Item
                    </Button> */}
                </CardFooter>
            </Card>

        </GridItem>
    )
}