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
    const [events, setEvents] = useState(null);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        Api.get(`/events/${id}`)
        .then((response) => {
            setEvents(response.data);
        })
        Api.get(`/roles`)
        .then((response) => {
            setRoles(response.data)
        })
    }, []);

    const handleSubmit = (values) => {
        Api.put(`/events/${id}`, {
            title: values.title,
            description: values.description,
            status: values.status,
            defaultValueIsVisible: values.defaultVisible, 
            fonctions: values.fonctions.map(fonction => `/api/roles/${fonction}`),
            fonctionAccreditations: values.fonctionAccreditations.map(fonction => `/api/roles/${fonction}`)
        })
        .then((response) => {
            window.location.href = "/event-list";
        })
    }

    const selectedFonctions = []
    const getFonctions = () => {
        events && events.fonctions.map(fonction => {
            const fonctionId = /[^/]*$/.exec(fonction)[0];
            selectedFonctions.push(parseInt(fonctionId));
        })
    }

    const selectedAccreditations = []
    const getAccreditations = () => {
        events && events.fonctionAccreditations.map(fonction => {
            const fonctionId = /[^/]*$/.exec(fonction)[0]
            selectedAccreditations.push(parseInt(fonctionId)) 
        })
    }

    getFonctions();
    getAccreditations()

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
            <h1>Modifier une catégorie d'événement</h1>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={{ title: events?.title, description: events?.description, defaultVisible: events?.defaultVisible }}
                    validate={values => {
                    const errors = {};
                    if (!values.title) {
                        errors.title = 'Vous devez renseigner un libellé.';
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
                            <label htmlFor="title">Libellé</label>
                            <Field className="input-field form-control" type="text" name="title"/>
                            <ErrorMessage className="error-message" name="title" component="div" />
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
                        </div>
                        <div className="form-group mt-5">
                            <div className='form-check'>
                                <Field className="input-field form-check-input" type="checkbox" name="status"/>
                                <label className="form-check-label" htmlFor='status'>Status actif ?</label>
                            </div>
                            <div className='form-check'>
                                <Field className="input-field form-check-input" type="checkbox" name="defaultVisible"/>
                                <label className="form-check-label" htmlFor='defaultVisible'>Le flag "Evenement visibe seulement pour les invité" est coché par défaut ?</label>
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