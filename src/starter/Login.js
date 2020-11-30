import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
import Footer from "../components/Footer/Footer.js";
import GridContainer from "../components/Grid/GridContainer.js";
import GridItem from "../components/Grid/GridItem.js";
import Button from "../components/CustomButtons/Button.js";
import Card from "../components/Card/Card.js";
import CardBody from "../components/Card/CardBody.js";
import CardHeader from "../components/Card/CardHeader.js";
import CardFooter from "../components/Card/CardFooter.js";
import CustomInput from "../components/CustomInput/CustomInput.js";
import { useHistory } from 'react-router-dom';

import styles from "assets/jss/material-kit-react/views/loginPage.js";
import image from "assets/img/bg8.jpg";

import fb from 'fb'

const useStyles = makeStyles(styles);

export default function Login() {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const history = useHistory()

    const [errorMessage, setErrorMessage] = useState("")
    const [errorCode, setErrorCode] = useState("")

    // useEffect(() => {
    //     login();
    //     setErrorMessage("");
    //     setErrorCode("");
    // }, []);

    // const login = async () => {
    //     await fb.auth().signInWithEmailAndPassword(email, password)
    //     // redirect to home page
    //     history.push("/")
    // }

    // const login = async () => {
    //     await fb.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
    //         var errorCode = error.code;
    //         var errorMessage = error.message;
    //         setErrorMsg(errorMessage)
    //         setErrorCode(errorCode)
    //         console.log(errorCode)
    //     });
    //     // redirect to home page if authentication is correct
    //     // redirect to login page if authentication fails
    //     if (errorCode === undefined){
    //         history.push("/")
    //     }
    // }

    const login = async (event) => {
        event.preventDefault();
        await fb.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                history.push("/")
            })
            .catch((error) => {
                setErrorMessage(error.message)
                setErrorCode(error.code)
            });
    }

    return (
        <div>
            <div
                className={classes.pageHeader}
                style={{
                    backgroundImage: "url(" + image + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "top center"
                }}
            >
                <div className={classes.container}>
                    <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={4}>
                            <Card className={classes[cardAnimaton]}>

                                <CardHeader color="primary" className={classes.cardHeader}>
                                    <h4>Login</h4>
                                    {/* <div className={classes.socialLine}>
                                        <Button
                                            justIcon
                                            href="#pablo"
                                            target="_blank"
                                            color="transparent"
                                            onClick={e => e.preventDefault()}
                                        >
                                            <i className={"fab fa-twitter"} />
                                        </Button>
                                        <Button
                                            justIcon
                                            href="#pablo"
                                            target="_blank"
                                            color="transparent"
                                            onClick={e => e.preventDefault()}
                                        >
                                            <i className={"fab fa-facebook"} />
                                        </Button>
                                        <Button
                                            justIcon
                                            href="#pablo"
                                            target="_blank"
                                            color="transparent"
                                            onClick={e => e.preventDefault()}
                                        >
                                            <i className={"fab fa-google-plus-g"} />
                                        </Button>
                                    </div> */}
                                </CardHeader>
                                <form className={classes.form} onSubmit={login}>
                                    <CardBody>
                                        <CustomInput
                                            onChange={event => setEmail(event.target.value)}
                                            labelText="Email"
                                            id="email"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event => setEmail(event.target.value),
                                                value: email,
                                                type: "email",
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Email className={classes.inputIconsColor} />
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <div>
                                            <CustomInput
                                                labelText="Password"
                                                id="pass"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: event => setPassword(event.target.value),
                                                    value: password,
                                                    type: "password",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Icon className={classes.inputIconsColor}>
                                                                lock_filled
                                                    </Icon>
                                                        </InputAdornment>
                                                    ),
                                                    autoComplete: "off"
                                                }}
                                            />
                                        </div>
                                    </CardBody>
                                    {
                                        errorMessage
                                        &&
                                        <button type="button" className="btn btn-secondary" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom" disabled="disabled" style={{ marginLeft: "15%", marginRight: "15%" }} >
                                            {errorMessage}
                                        </button>
                                    }
                                    <CardFooter className={classes.cardFooter}>
                                        <Button type="submit" simple color="primary" size="lg">
                                            Login
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
                <Footer whiteFont />
            </div>
        </div>
    );
}
