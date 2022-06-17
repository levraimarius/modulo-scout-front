import React, { useEffect, useState } from 'react';
import Api from "../Api"
import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Wysiwyg from '../Wysiwyg';


const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function EditEvents() {
    let { id } = useParams();
    const [event, setEvent] = useState(null);

    useEffect(() => {
        Api.get(`/events/${id}`)
        .then((response) => {
            setEvent(response.data);
        })
    }, []);
    console.log(event)
    return (
    <>
        <div className="container mt-5">
            <h1>Modifier un événement</h1>
        </div>
    </>
    )
}