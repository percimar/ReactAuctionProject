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



const useStyles = makeStyles(styles);

export default function AnsweredFaqs({ id, faq }) {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [answer, setAnswer] = useState("")
    const [newAnswer, setNewAnswer] = useState("")

    const valid = () =>
        answer !== ""

    const update = async () => {
        await db.FAQs.update({ id, answererUserId: user.id, answer: answer, question: faq.question, askerUserId: faq.askerUserId })
        setAnswer("")
        // { console.log(faq) }
    }

    const remove = async () => {
        db.FAQs.remove(id)
    }





    return (
        <>
            {
                user
                    ?
                    user.role === "admin" || user.role === "moderator"
                        ?
                        <div>
                            <Card className={classes[cardAnimaton]}>
                                <CardBody>
                                    QUESTION: {faq.question}
                                    <hr />
                                    ANSWER: {faq.answer}
                                    {faq.answer === ""
                                        &&
                                        <>
                                            <CustomInput
                                                labelText="Answer"
                                                id="answer"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: event => setAnswer(event.target.value),
                                                    value: answer,
                                                    type: "text"
                                                }}
                                            />
                                            <div style={{ textAlign: "center" }} >
                                                <Button simple color="info" size="lg" disabled={!valid()} onClick={update}>
                                                    Submit Answer
                                                </Button>
                                                <Button simple color="danger" size="lg" onClick={remove}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </>
                                    }
                                    {faq.answer !== ""
                                        &&
                                        <>
                                            <CustomInput
                                                labelText="Answer"
                                                id="answer"
                                                formControlProps={{
                                                    fullWidth: true
                                                }}
                                                inputProps={{
                                                    onChange: event => setAnswer(event.target.value),
                                                    value: answer,
                                                    type: "text"
                                                }}
                                            />
                                            <div style={{ textAlign: "center" }} >
                                                <Button simple color="info" size="lg" disabled={!valid()} onClick={update}>
                                                    Update Answer
                                                </Button>
                                                <Button simple color="danger" size="lg" onClick={remove}>
                                                    Delete
                                                </Button>
                                            </div>

                                        </>
                                    }
                                    
                                </CardBody>
                            </Card>
                        </div>
                        :
                        faq.answer !== ""
                        &&
                        <div>
                            <Card className={classes[cardAnimaton]}>
                                <CardBody>
                                    QUESTION: {faq.question}
                                    <hr />
                                    ANSWER: {faq.answer}
                                </CardBody>
                            </Card>
                        </div>
                    :
                    faq.answer !== "" 
                    &&
                    <div>
                        <Card className={classes[cardAnimaton]}>
                            <CardBody>
                                QUESTION: {faq.question}
                                <hr />
                                ANSWER: {faq.answer}
                            </CardBody>
                        </Card>
                    </div>

            }


        </>

    )
}
