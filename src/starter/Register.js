import React, { useState } from "react";
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
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import image from "../assets/img/bg8.jpg";
import fb from '../fb'
import db from '../db'

const useStyles = makeStyles(styles);

export default function Register() {

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [name, setName] = useState("")

    const history = useHistory()

    const register = async () => {
        if (password === password2) {
            try {
                await fb.auth().createUserWithEmailAndPassword(email, password)
                console.log(fb.auth().currentUser.uid)
                await db.Users.update({ id: fb.auth().currentUser.uid, name, role: "user" })
                history.push("/")
            } catch (error) {
                alert(error.message)
            }
        }
    }

    const valid = () =>
        email !== "" &&
        password !== "" &&
        password2 !== "" &&
        name !== ""


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
                                    <h4>Register</h4>
                                </CardHeader>
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
                                    <CustomInput
                                        labelText="Name"
                                        id="name"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => setName(event.target.value),
                                            value: name,
                                            type: "text",
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Icon className={classes.inputIconsColor}>
                                                        assignmentind
                                                    </Icon>
                                                </InputAdornment>
                                            ),
                                            autoComplete: "off"
                                        }}
                                    />
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
                                    <CustomInput
                                        labelText="Password Again"
                                        id="pass2"
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            onChange: event => setPassword2(event.target.value),
                                            value: password2,
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
                                </CardBody>
                                <CardFooter className={classes.cardFooter}>
                                    <Button disabled={!valid()} simple color="primary" size="lg" onClick={register}>
                                        Register
                                    </Button>
                                </CardFooter>
                            </Card>
                        </GridItem>
                    </GridContainer>
                </div>
                <Footer whiteFont />
            </div>
        </div>
    );
}
