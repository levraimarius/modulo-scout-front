import React, { useEffect, useState } from 'react';
import Api from "../Api"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams,
    BrowserRouter
} from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ListItem from '../ListItem/ListItem';
import { Icon } from '@iconify/react';
import Wysiwyg from '../Wysiwyg';


const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function CategoryAdd() {

    const handleSubmit = (values) => {
        console.log(values.status)
        Api.post('/event_categories', {
            label: values.label,
            description: values.description,
            status: values.status,
            defaultValueIsVisible: values.defaultVisible
        })
        .then((response) => {
            <BrowserRouter to="/event-categories" />
        })
        .catch(err => console.log(err))
    }

    return (
    <>
        <div className="container mt-5">
            <h1>Ajouter un événement</h1>
            <div>
                <Formik
                    initialValues={{ label: '', description: '', status: false, defaultVisible: false }}
                    validate={values => {
                    const errors = {};
                    if (!values.label) {
                        errors.label = 'Vous devez renseigner un libellé.';
                    }
                    if (!values.description) {
                        errors.description = 'Vous devez renseigner une description';
                    }
                    return errors;
                    }}
                    onSubmit={(values) => {
                        handleSubmit(values)
                    }}
                >
                
                    {({ isSubmitting }) => (
                    <Form className="form">
                        <Field className="input-field" type="text" name="label"/>
                        <ErrorMessage className="error-message" name="label" component="div" />
                        <Field
                            component={Wysiwyg}
                            name="description"
                            placeholder="Description"
                        />
                        <ErrorMessage className="error-message" name="description" component="div" />
                        <Field className="input-field" type="checkbox" name="status"/>
                        <Field className="input-field" type="checkbox" name="defaultVisible"/>
                        <button className="submit-button" type="submit">
                        Ajouter
                        </button>
                    </Form>
                    )}
                </Formik>
            </div>
        </div>
    </>
    )
}