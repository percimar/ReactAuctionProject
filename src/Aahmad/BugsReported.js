import React, { useState, useContext, useEffect } from "react";
import db from '../db'
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import CustomInput from "../components/CustomInput/CustomInput.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'
import { useHistory } from 'react-router-dom';
import Parallax from "../components/Parallax/Parallax.js";
import NavPills from "../components/NavPills/NavPills.js";
import GridContainer from "../components/Grid/GridContainer.js";
import classNames from "classnames";
import Footer from "../components/Footer/Footer.js";

import CustomDropdown from 'components/CustomDropdown/CustomDropdown.js';


const useStyles = makeStyles(styles);

export default function BugsReported({ id, bug }) {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [status, setStatus] = useState("")

    const valid = () =>
        status !== ""

    const update = async () => {
        await db.Bugs.update({ id, reporterUserId: bug.reporterUserId, bug: bug.bug, severity: bug.severity, status: status })
    }

    const remove = async () => {
        db.Bugs.remove(id)
    }

    return (
        <>
            {
                user
                    ?
                    user.role!='user'
                        ?
                        <div>
                            <Card className={classes[cardAnimaton]}>
                                <CardBody>
                                    Bug Reported: {bug.bug}
                                    <hr />
                                    Current Status: {bug.status.toUpperCase()}
                                    {
                                        <>
                                        <div style={{ textAlign: "center" }} >
                                            <CustomDropdown
                                                dropup
                                                dropdownHeader="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;STATUS"
                                                buttonText={status}
                                                buttonProps={{
                                                    round: true,
                                                    color: "github"
                                                }}
                                                dropdownList={[
                                                    <Button value="pending" id="pending" simple color="danger" size="lg" onClick={event => setStatus(event.target.value)}>
                                                    Pending
                                                    </Button>,
                                                    <Button value="resolved" id="resolved" simple color="success" size="lg" onClick={event => setStatus(event.target.value)}>
                                                    Resolved
                                                    </Button>
                                                ]}
                                            />
                                            <Button simple color="info" size="lg" disabled={!valid()} onClick={update}>
                                                <i className="material-icons">upgrade</i>
                                                Update Status
                                            </Button>
                                            {/* <Button simple color="danger" size="lg" onClick={remove}>
                                                    <i className="material-icons">delete</i>
                                                    Delete
                                                </Button> */}
                                        </div>
                                        </>
                                    }
                                </CardBody>
                            </Card>
                        </div>
                        :
                        bug.reporterUserId === user.id
                        &&
                        <div>
                            <GridContainer>
                                <GridItem xs={12} sm={12} md={6}>
                                    <Card className={classes[cardAnimaton]}>
                                        <CardBody>
                                            Bug Reported: {bug.bug}
                                            <hr />
                                            Current Status: {bug.status.toUpperCase()}
                                        </CardBody>
                                    </Card>
                                </GridItem>
                            </GridContainer>

                        </div>
                    :
                    ""

            }


        </>

    )
}
