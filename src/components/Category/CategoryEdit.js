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
import axios from 'axios';


const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function CategoryEdit() {
    let { id } = useParams();
    const [category, setCategory] = useState(null);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        Api.get(`/event_categories/${id}`)
        .then((response) => {
            setCategory(response.data);
        })
        Api.get(`/roles`)
        .then((response) => {
            setRoles(response.data)
        })
    }, []);

    const handleSubmit = (values) => {
        Api.put(`/event_categories/${id}`, {
            label: values.label,
            description: values.description,
            status: values.status,
            defaultValueIsVisible: values.defaultVisible, 
            fonctions: values.fonctions.map(fonction => `/api/roles/${fonction}`)
        })
        .then((response) => {
            window.location.href = "/event-categories";
        })
        .catch(err => console.log(err))
    }

    const selectedFonctions = []
    const getFonctions = () => {
        category && category.fonctions.map(fonction => {
            const fonctionId = /[^/]*$/.exec(fonction)[0];
            selectedFonctions.push(parseInt(fonctionId));
        })
    }

    getFonctions();
    console.log(selectedFonctions)

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
            <h1>Modifier une catégroie d'événement</h1>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={{ label: category?.label, description: category?.description, status: category?.status, defaultVisible: category?.defaultValueIsVisible, fonctions: selectedFonctions }}
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
                        <div className="form-group mt-5">
                            <label htmlFor="label">Libellé</label>
                            <Field className="input-field form-control" type="text" name="label"/>
                            <ErrorMessage className="error-message" name="label" component="div" />
                        </div>
                        <div className="form-group mt-5">
                            <Field
                                component={Wysiwyg}
                                name="description"
                                placeholder="Description"
                            />
                            <ErrorMessage className="error-message" name="description" component="div" />
                        </div>
                        <div className="form-group mt-5">
                            <Field as="select" name="fonctions" className="form-select" multiple>
                                {fonctionOptions}
                            </Field>
                        </div>
                        <div className="form-group mt-5">
                            <div className='form-check'>
                                <Field className="input-field form-check-input" type="checkbox" name="status"/>
                                <label className="form-check-label">Status actif ?</label>
                            </div>
                            <div className='form-check'>
                                <Field className="input-field form-check-input" type="checkbox" name="defaultVisible"/>
                                <label className="form-check-label">Le flag "Evenement visibe seulement pour les invité" est coché par défaut ?</label>
                            </div>
                        </div>

                        <button className="submit-button btn btn-success mt-5" type="submit">
                        Modifier
                        </button>
                    </Form>
                    )}
                </Formik>
            </div>
        </div>
    </>
    )
}