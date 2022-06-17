import React, { useEffect, useState } from 'react';
import Api from "../Api";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams
} from "react-router-dom";
import Wysiwyg from '../Wysiwyg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { isAccredited } from '../Accreditations';

const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function CreateEvent() {
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);
    const [defaultRoles, setDefaultRoles] = useState([]);
    
    let { id } = useParams();

    const currentScope = JSON.parse(localStorage.getItem('currentScope'));
    const currentRole = currentScope[1][0];
    const currentStructure = currentScope[0][0];

    const defaultRole = (e) => {

        Api.get(`/event_categories/${e.target.value}`)
        .then((response) => {
            setDefaultRoles(response.data.fonctions.map(data => parseInt(/[^/]*$/.exec(data)[0])));
        })
    }

    const handleSubmit = (values) => {
    
    }

    const searchPerson = () => {

    }

    useEffect(() => {

        // Get the categories the user is accredited to create
        Api.get(`/event_categories?fonctionAccreditations=${currentRole}`)
        .then((response) => {
            setCategories(response.data.map(data => <option value={data.id} key={data.id}>{data.label}</option>));
            setDefaultRoles(response.data[0].fonctions.map(data => parseInt(/[^/]*$/.exec(data)[0])))
        })
        Api.get(`/roles`)
        .then((response) => {
            setRoles(response.data.map(data => <option value={data.id} key={data.id}>{data.name}</option>));
        })

        // If structure has children, show structures
        Api.get(`/structures?parentStructure=${currentStructure}&pagination=false`)
            .then(Api.get(`/structures?pagination=false`)
            .then(response => )
            })
    }, []);

    return (
    <>
        <div className="container mt-5">
            <h1>Create Event</h1>
            <div>
                <Formik
                    enableReinitialize
                    initialValues={{ start: "", end: "", title: "", category: "", description: "", roles: defaultRoles, invitedPersons: "", isVisible: true, linkedStructures: '' }}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="col g-1">
                            <div className="col-6">
                                <label htmlFor="firstName">Date de début</label>
                                <Field type="date" name="start" placeholder="date de début" className="form-control" />
                                <ErrorMessage name="start" component="div" className="error-form" />
                            </div>
                            <div className="col-6">
                                <label htmlFor="firstName">Date de fin</label>
                                <Field type="date" name="end" placeholder="date de fin" className="form-control" />
                                <ErrorMessage name="end" component="div" className="error-form" />
                            </div>
                            <div className="col-6">
                                <label htmlFor="firstName">Titre</label>
                                <Field type="text" name="title" placeholder="titre" className="form-control" />
                                <ErrorMessage name="title" component="div" className="error-form" />
                            </div>
                            <div className="form-group mt-5">
                                <label htmlFor='description'>Description</label>
                                <Field
                                    component={Wysiwyg}
                                    name="description"
                                    placeholder="Description"
                                />
                                <ErrorMessage className="error-message" name="description" component="div" />
                            </div>
                            <div className="form-group mt-5">
                                <label htmlFor='category'>Catégorie</label>
                                <select as="select" name="category" className="form-select" onChange={defaultRole}>
                                    {categories}
                                </select>
                                <ErrorMessage className="error-message" name="category" component="div" />
                            </div>
                            <div className="form-group mt-5">
                                <label htmlFor='roles'>roles invités</label>
                                <Field as="select" name="roles" className="form-select" multiple>
                                    {roles}
                                </Field>
                                <ErrorMessage className="error-message" name="roles" component="div" />
                            </div>
                            <div className="form-group mt-5">
                                <label htmlFor='person'>Personnes invitées</label>
                                <Field type="text" name="person" placeholder="titre" className="form-control" onChange={searchPerson}/>
                                <ErrorMessage name="person" component="div" className="error-form" />
                            </div>
                            <div className='form-check'>
                                <Field className="input-field form-check-input" type="checkbox" name="status"/>
                                <label className="form-check-label" htmlFor='status'>Est visible à tous ?</label>
                            </div>
                            <button type="submit" className="btn btn-light col-auto my-3">
                                Envoyer
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </>
    )
}