import React, { useEffect, useState } from 'react';
import Api from "../Api";
import {
    BrowserRouter as Router,
    useParams,
    useSearchParams
} from "react-router-dom";
import Wysiwyg from '../Wysiwyg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormControl, Table } from "react-bootstrap";
import { EMPTY } from 'draft-js/lib/CharacterMetadata';
import { isAccredited } from '../Accreditations';
import SearchSelect from '../SearchSelect/SearchSelect';
import { searchUser, searchRole} from './Utils';

export default function AddEvent() {
    let { id } = useParams();

    const   [categories, setCategories] = useState([]),
            [roles, setRoles] = useState([]),
            [loading, setLoading] = useState(true),
            [users, setUsers] = useState(),
            [disabled, setDisabled] = useState(false),
            [search, setSearch] = useState(),
            [isMenuOpen, setIsMenuOpen] = useState(false),
            { page } = useParams(),
            [defaultRoles, setDefaultRoles] = useState([]),
            [defaultUsers, setDefaultUsers] = useState([]),
            [changeRoles, setChangeRoles] = useState(false),
            [addInvited, setAddInvited] = useState(false),
            [changeVisibility, setChangeVisibility] = useState(false),
            [structures, setStructure] = useState([]),
            [searchParams, setSearchParams] = useSearchParams();

    const currentScope = JSON.parse(localStorage.getItem('currentScope'));
    const currentRole = currentScope[1][0];
    const currentStructure = currentScope[0][0];

    const defaultRole = (e) => {
        e.target.value !== "0" && Api.get(`/event_categories/${e.target.value}`)
        .then((response) => {
            setDefaultRoles(response.data.fonctions);
        })
    }

    const handleSubmit = (values) => {
        Api.post('/events', {
            startAt: `${values.start}`,
            endAt: `${values.end}`,
            title: values.title,
            category: `/api/event_categories/${values.category}`,
            description: values.description,
            invitedRoles: defaultRoles.map(role => `/api/roles/${role.id}`),
            invitedPersons: defaultUsers.map(person => `/api/users/${person.id}`),
            isVisible: values.isVisible,
            linkedStructures: structures ? values.linkedStructures.map(structure => `/api/structures/${structure}`) : ''
        })
        .then((response) => {
            window.location.href = "/agenda";
        })
    }

    useEffect(() => {
        Api.get(`/event_categories?fonctionAccreditations=${currentRole}`)
        .then((response) => {
            setCategories(response.data.map(data => <option value={data.id} key={data.id}>{data.label}</option>));
            //setDefaultRoles(response.data[0].fonctions.map(data => parseInt(/[^/]*$/.exec(data)[0])))
        })

        // If structure has children, show structures
        Api.get(`/structures?parentStructure=${currentStructure}&pagination=false`)
        .then((response) => {
            setStructure(response.data)
        }).catch(err => console.log(err));
        
        isAccredited(9).then(response => setChangeRoles(response));
        isAccredited(10).then(response => setAddInvited(response));
        isAccredited(11).then(response => setChangeVisibility(response));
    }, []);

    const validate = (values) => {
        const errors = {};

        if (values.start > values.end) {
            errors.start = "Veuillez saisir une date de d??but ant??rieure ?? la date de fin."
        }

        if (values.end > values.start) {
            errors.end = "Veuillez saisir une date de fin post??rieure ?? la date de d??but."
        }

        if (!values.end) {
            errors.end = "Veuillez saisir une date de fin."
        }

        if (!values.start) {
            errors.end = "Veuillez saisir une date de d??but."
        }

        if (!values.title) {
            errors.title = "Veuillez saisir un titre."
        }
        
        console.log(values.category)
        if (values.category === "0") {
            errors.category = "Veuillez saisir une cat??gorie."
        }

        if (!values.description) {
            errors.description = "Veuillez saisir une description."
        }

        return errors;
    };

    return (
    <>
        <div className="container my-5">
            <h1>Cr??ation d'un ??v??nement</h1>

            <div className="my-5">
                <Formik
                    initialValues={{ start: searchParams ? `${searchParams.get("start")}T00:00` : '', end: searchParams ? `${searchParams.get("end")}T00:00` : '', title: "", category: "", description: "", roles: '', invitedPersons: [], isVisible: true, linkedStructures: '' }}
                    onSubmit={handleSubmit}
                    validate={validate}
                >
                    {({ isSubmitting }) => (
                        <Form className="col">
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="firstName">Date de d??but</label>
                                    <Field type="datetime-local" name="start" placeholder="date de d??but" className="form-control" />
                                    <ErrorMessage name="start" component="div" className="error-form" />
                                </div>

                                <div className="col-6">
                                    <label htmlFor="firstName">Date de fin</label>
                                    <Field type="datetime-local" name="end" placeholder="date de fin" className="form-control" />
                                    <ErrorMessage name="end" component="div" className="error-form" />
                                </div>
                            </div>

                            <div className="row my-3">
                                <div className="col-6">
                                    <label htmlFor="firstName">Titre</label>
                                    <Field type="text" name="title" placeholder="titre" className="form-control" />
                                    <ErrorMessage name="title" component="div" className="error-form" />
                                </div>

                                <div className="col-6 form-group">
                                    <label htmlFor='category'>Cat??gorie</label>
                                    <Field as="select" name="category" className="form-select" onClick={defaultRole}>
                                        <option value='0'>Choisissez une cat??gorie</option>
                                        {categories}
                                    </Field>
                                    <ErrorMessage className="error-form" name="category" component="div" />
                                </div>
                            </div>

                            <div className="form-group my-3">
                                <label htmlFor='description'>Description</label>
                                <Field
                                    component={Wysiwyg}
                                    name="description"
                                    placeholder="Description"
                                />
                                <ErrorMessage className="error-message" name="description" component="div" />
                            </div>

                            <div>
                                <div>
                                    {changeRoles &&
                                        <>
                                            <SearchSelect defaultItem={defaultRoles} setDefaultItem={setDefaultRoles} name='Roles invit??s' search='roles'/>
                                        </>
                                    }
                                </div>
                            </div>
                            {addInvited &&
                                    <SearchSelect defaultItem={defaultUsers} setDefaultItem={setDefaultUsers} name="Invitation nominatives" search='users'/>    
                                }
                                <div>
                                    {structures &&
                                    <>
                                        <label htmlFor='linkedStructures'>Structure associ??e</label>
                                        <Field as="select" name="linkedStructures" className="form-select" multiple>
                                            <option value={currentStructure}>{currentScope[0][1]}</option>
                                            {structures.map(structure => <option value={structure.id} key={structure.value}>{structure.name}</option>)}
                                        </Field>
                                        <ErrorMessage className="error-message" name="linkedStructures" component="div" />
                                    </>
                                    }
                                    {changeVisibility &&
                                        <div className="my-3">
                                            <div className='form-check'>
                                                <Field className="input-field form-check-input" type="checkbox" name="isVisible"/>
                                                <label className="form-check-label" htmlFor='isVisible'>Est visible ?? tous ?</label>
                                            </div>
                                        </div>
                                    }
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
