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
    const [roles, setRoles] = useState(null);
    useEffect(() => {
        Api.get('/roles')
        .then((response) => {
            setRoles(response.data);
        })
        .catch(err => console.log(err))
    }, []);

    const handleSubmit = (values) => {
        console.log(values.fonctions.map(fonction => `/api/roles/${fonction}`));
        Api.post('/event_categories', {
            label: values.label,
            description: values.description,
            status: values.status,
            defaultValueIsVisible: values.defaultVisible,
            fonctions: values.fonctions.map(fonction => `/api/roles/${fonction}`)
        })
        .then((response) => {
            console.log(response)
        })
        .catch(err => console.log(err))
    }
    
    const fonctionOptions = []
    const setFonctionOptions = () => {
        {roles && roles.map(role => {
            fonctionOptions.push(<option value={role.id}>{role.name}</option>)
        })}
    }

    setFonctionOptions();
    return (
    <>
        <div className="container mt-5">
            <h1>Ajouter un événement</h1>
            <div>
                <Formik
                    initialValues={{ label: '', description: '', status: false, defaultVisible: false, fonctions: '' }}
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
                        <Field as="select" name="fonctions" multiple>
                            {fonctionOptions}
                        </Field>
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