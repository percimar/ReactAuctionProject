
import { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import Footer from "../components/Footer/Footer.js";
import Button from "../components/CustomButtons/Button.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Parallax from "../components/Parallax/Parallax.js";
import image from "../assets/img/bg8.jpg";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../assets/jss/material-kit-react/views/loginPage.js";
import UserContext from '../UserContext'
import db from '../db'
import AuctionDetails from '../Carlos/AuctionDetails'

const useStyles = makeStyles(styles);

export default function Logs() {

    const classes = useStyles();

    const { user } = useContext(UserContext)

    const [logs, setLogs] = useState([]);
    useEffect(() => db.Logs.listenAll(setLogs), [])

    return (
        < div >
            <Parallax small filter image={image}>
            </Parallax>

            <div className={classNames(classes.main, classes.mainRaised)} >
                <div className={classes.container}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Timestamp</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Collection</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell component="th" scope="row">
                                            {log.timestamp.toDateString()}
                                        </TableCell>
                                        <TableCell>{log.username}</TableCell>
                                        <TableCell>{log.userroles}</TableCell>
                                        <TableCell>{log.collection}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <Footer />
        </div >

    )
}