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
import GridContainer from "../components/Grid/GridContainer.js";
import classNames from "classnames";
import Footer from "../components/Footer/Footer.js";
import image from "../assets/img/bg8.jpg";

import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";


import BugsReported from './BugsReported'




const useStyles = makeStyles(styles);

export default function Bugs() {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [bugReport, setBugReport] = useState("")
    const [type, setType] = useState("")

    const [selectedEnabled, setSelectedEnabled] = React.useState("b");
    const wrapperDiv = classNames(
        classes.checkboxAndRadio,
        classes.checkboxAndRadioHorizontal)

    const [bugs, setBugs] = useState([])

    useEffect(() => db.Bugs.listenAll(setBugs), [])

    const valid = () =>
        bugReport !== "" &&
        (selectedEnabled === "low" || selectedEnabled === "medium" || selectedEnabled === "high")

    const create = async () => {
        await db.Bugs.create({ reporterUserId: user.id, bug: bugReport, severity: selectedEnabled, status: "pending" })
        setBugReport("")
    }


    return (

        <div>
            <Parallax filter image={image}>
                <div className={classes.container}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <h1 className={classes.title}>Report a Bug</h1>
                        </GridItem>
                    </GridContainer>
                </div>
            </Parallax>

            <div className={classNames(classes.main, classes.mainRaised)}>
                <div className={classes.container}>
                    <Card className={classes[cardAnimaton]}>
                        {
                            user
                                ?
                                user.role !== "admin"
                                &&
                                <>
                                    <CardBody>
                                        <CustomInput
                                            labelText="Bug"
                                            id="bugReport"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event => setBugReport(event.target.value),
                                                value: bugReport,
                                                type: "text"
                                            }}
                                        />
                                        <div>
                                            <div className={wrapperDiv}>
                                                <FormControlLabel
                                                    control={
                                                        <Radio
                                                            checked={selectedEnabled === "low"}
                                                            onChange={() => setSelectedEnabled("low")}
                                                            value="low"
                                                            name="Low radio button"
                                                            aria-label="Loq"
                                                            icon={
                                                                <FiberManualRecord
                                                                    className={classes.radioUnchecked}
                                                                />
                                                            }

                                                            checkedIcon={
                                                                <FiberManualRecord className={classes.radioChecked} />
                                                            }
                                                            classes={{
                                                                checked: classes.radio
                                                            }}
                                                        />
                                                    }
                                                    classes={{
                                                        label: classes.label
                                                    }}
                                                    label="Low"
                                                />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <FormControlLabel
                                                    control={
                                                        <Radio
                                                            checked={selectedEnabled === "medium"}
                                                            onChange={() => setSelectedEnabled("medium")}
                                                            value="medium"
                                                            name="Medium radio button"
                                                            aria-label="Medium"
                                                            icon={
                                                                <FiberManualRecord
                                                                    className={classes.radioUnchecked}
                                                                />
                                                            }
                                                            checkedIcon={
                                                                <FiberManualRecord className={classes.radioChecked} />
                                                            }
                                                            classes={{
                                                                checked: classes.radio
                                                            }}
                                                        />
                                                    }
                                                    classes={{
                                                        label: classes.label
                                                    }}
                                                    label="Medium"
                                                />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <FormControlLabel
                                                    control={
                                                        <Radio
                                                            checked={selectedEnabled === "high"}
                                                            onChange={() => setSelectedEnabled("high")}
                                                            value="c"
                                                            name="High radio button"
                                                            aria-label="High"
                                                            icon={
                                                                <FiberManualRecord
                                                                    className={classes.radioUnchecked}
                                                                />
                                                            }
                                                            checkedIcon={
                                                                <FiberManualRecord className={classes.radioChecked} />
                                                            }
                                                            classes={{
                                                                checked: classes.radio
                                                            }}
                                                        />
                                                    }
                                                    classes={{
                                                        label: classes.label
                                                    }}
                                                    label="High"
                                                />
                                            </div>

                                        </div>

                                    </CardBody>
                                    <CardFooter className={classes.cardFooter}>
                                        <Button simple color="info" size="lg" disabled={!valid()} onClick={create}>
                                            Submit Bug Report
                                        </Button>
                                    </CardFooter>
                                </>
                                :
                                ""
                        }
                    </Card>


                    {bugs.map(item => (
                        <BugsReported
                            key={item.id}
                            id={item.id}
                            {...item}
                            bug={item}
                        />
                    ))}

                </div>
            </div>
            <Footer />
        </div >
    )
}
