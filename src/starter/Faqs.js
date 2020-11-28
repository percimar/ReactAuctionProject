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

import AnsweredFaqs from './AnsweredFaqs'




const useStyles = makeStyles(styles);

export default function Faqs() {

    const { user } = useContext(UserContext)

    const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
    setTimeout(function () {
        setCardAnimation("");
    }, 700);
    const classes = useStyles();

    const [question, setQuestion] = useState("")
    // const [askerUserId, setAskerUserId] = useState("")

    const [faqs, setFaqs] = useState([])

    useEffect(() => db.FAQs.listenAll(setFaqs), [])

    // const getAll = async () => {
    //     var all = await db.FAQs.findAll()
    //     setFaqs(all)
    // }
    // getAll()

    const valid = () =>
        question !== ""

    const create = async () => {
        await db.FAQs.create({ askerUserId: user.id, question: question, answer: "", answererUserId: "" })
        setQuestion("")
    }


    return (
        // <GridItem xs={12} sm={12} md={4}>
        //     <Card className={classes[cardAnimaton]}>
        //         <CardBody>
        //             <CustomInput
        //                 labelText="Question"
        //                 id="question"
        //                 formControlProps={{
        //                     fullWidth: true
        //                 }}
        //                 inputProps={{
        //                     onChange: event => setQuestion(event.target.value),
        //                     value: question,
        //                     type: "text"
        //                 }}
        //             />
        //         </CardBody>
        //         <CardFooter className={classes.cardFooter}>
        //             <Button simple color="primary" size="lg" disabled={!valid()} onClick={create}>
        //                 Submit Question
        //                 {/* {console.log(user)} */}
        //             </Button>
        //         </CardFooter>
        //     </Card>
        // </GridItem>



        <div>
            <Parallax filter image={"assets/img/landing-bg.jpg"}>
                <div className={classes.container}>
                    <GridContainer>
                        <GridItem xs={12} sm={12} md={6}>
                            <h1 className={classes.title}>Frequently Asked Questions</h1>
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
                                <>
                                    <CardBody>
                                        <CustomInput
                                            labelText="Question"
                                            id="question"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event => setQuestion(event.target.value),
                                                value: question,
                                                type: "text"
                                            }}
                                        />
                                    </CardBody>
                                    <CardFooter className={classes.cardFooter}>
                                        <Button simple color="info" size="lg" disabled={!valid()} onClick={create}>
                                            Submit Question
                                        </Button>
                                    </CardFooter>
                                </>
                                :
                                ""
                        }
                    </Card>


                    {faqs.map(item => (
                        <AnsweredFaqs
                            key={item.id}
                            id={item.id}
                            {...item}
                            faq={item}
                        />
                    ))}

                </div>
            </div>
            <Footer />
        </div>
    )
}
