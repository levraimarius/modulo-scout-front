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
    }, []);

    const handleSubmit = (values) => {
        Api.post('/event_categories', {
            label: values.label,
            description: values.description,
            status: values.status,
            defaultValueIsVisible: values.defaultVisible,
            fonctions: values.fonctions.map(fonction => `/api/roles/${fonction}`),
            fonctionAccreditations: values.fonctionAccreditations.map(fonction => `/api/roles/${fonction}`)
        })
        .then((response) => {
            window.location.href = "/event-categories";
        })
    }
    
    const fonctionOptions = []
    const setFonctionOptions = () => {
        {roles && roles.map(role => {
            fonctionOptions.push(<option value={role.id} key={role.id}>{role.name}</option>)
        })}
    }

    setFonctionOptions();
    return (
    <>
        <div className="container mt-5">
            <h1>Ajouter une catégorie d'événement</h1>
            <div>
                <Formik
                    initialValues={{ label: '', description: '', status: false, defaultVisible: false, fonctions: [], fonctionAccreditations: [] }}
                    validate={values => {
                    const errors = {};
                    if (!values.label) {
                        errors.label = 'Vous devez renseigner un libellé';
                    }
                    if (!values.description) {
                        errors.description = 'Vous devez renseigner une description';
                    }
                    if (values.fonctionAccreditations.length === 0) {
                        errors.fonctionAccreditations = 'Vous devez sélectionner au moins un rôle'
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
                            <label htmlFor='description'>Template de l'événement</label>
                            <Field
                                component={Wysiwyg}
                                name="description"
                                placeholder="Description"
                            />
                            <ErrorMessage className="error-message" name="description" component="div" />
                        </div>
                        <div className="form-group mt-5">
                            <label htmlFor='fonctions'>Fonctions invitées par défaut</label>
                            <Field as="select" name="fonctions" className="form-select" multiple>
                                {fonctionOptions}
                            </Field>
                        </div>
                        <div className="form-group mt-5">
                            <label htmlFor='fonctionAccreditations'>Fonctions habilitées à créer un événement de cette catégorie</label>
                            <Field as="select" name="fonctionAccreditations" className="form-select" multiple>
                                {fonctionOptions}
                            </Field>
                            <ErrorMessage className="error-message" name="fonctionAccreditations" component="div" />
                        </div>
                        <div className="form-group mt-5">
                            <div className='form-check'>
                                <Field className="input-field form-check-input" type="checkbox" name="status"/>
                                <label className="form-check-label" htmlFor='status'>Status actif ?</label>
                            </div>
                            <div className='form-check'>
                                <Field className="input-field form-check-input" type="checkbox" name="defaultVisible"/>
                                <label className="form-check-label" htmlFor='defaultVisible'>Le flag "Evénement visible seulement pour les invités" est coché par défaut ?</label>
                            </div>
                        </div>

                        <button className="submit-button btn btn-success mt-5" type="submit">
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