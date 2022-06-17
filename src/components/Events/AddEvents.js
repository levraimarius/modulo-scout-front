import React, { useEffect, useState } from 'react';
import Api from "../Api";
import {
    BrowserRouter as Router,
    useParams
} from "react-router-dom";
import Wysiwyg from '../Wysiwyg';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { FormControl, Table } from "react-bootstrap";
import { EMPTY } from 'draft-js/lib/CharacterMetadata';

export default function AddEvent() {
    const   [categories, setCategories] = useState([]),
            [roles, setRoles] = useState([]),[loading, setLoading] = useState(true),
            [users, setUsers] = useState(),
            [disabled, setDisabled] = useState(false),
            [search, setSearch] = useState(),
            [isMenuOpen, setIsMenuOpen] = useState(false),
            { page } = useParams(),
            [defaultRoles, setDefaultRoles] = useState([]);
    
    let { id } = useParams();

    const currentScope = JSON.parse(localStorage.getItem('currentScope'));
    const currentRole = currentScope[1][0];

    const [guests, setGuests] = useState('');

    const getGuests = (e) => {
        setGuests(Array.from(e.target.selectedOptions, option => option.text));
    }

    const defaultRole = (e) => {
    
        Api.get(`/event_categories/${e.target.value}`)
        .then((response) => {
            setDefaultRoles(response.data.fonctions.map(data => parseInt(/[^/]*$/.exec(data)[0])));
        })
    }

    const handleSubmit = (values) => {
        console.log(values)
        Api.post('/events', {
            startAt: `${values.start} 18:52:51`,
            endAt: `${values.end} 18:52:51`,
            title: values.title,
            category: `/api/event_categories/${values.category}`,
            description: values.description,
            roles: values.roles.map(role => `/api/roles/${role}`),
            invitedPersons: values.invitedPersons.map(person => `/api/users/${person}`),
            isVisible: values.isVisible,
            structure: `/api/structures/1`
        })
        .then((response) => {
            window.location.href = "/event-categories";
        })
        
    }


    const searchPerson = (search = undefined) => {
        Api.get((search === '' || search === undefined) ? `users?page=${page}` : `users?page=${page}&lastName=${search}`)
        .then(res => {
            const status = res.status

            if (status === 200) {
                setUsers(res.data)

                /**
                 * Check if the next page has some data (else the next btn from pagination will be disabled)
                 */
                Api.get(`users?page=${parseInt(page) + 1}`)
                .then(res => {
                    res.data.length === 0 && setDisabled(true)
                })
                .catch(err => {
                    console.log(err);
                })

                setLoading(false)
            } else {
                console.log(`Status HTTP : ${status}`)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    const deleteGuest = (i) => {
        setGuests(guests.filter((data, index) => {return index !== i}))
    }

    useEffect(() => {
        Api.get(`/event_categories?fonctionAccreditations=${currentRole}`)
        .then((response) => {
            setCategories(response.data.map(data => <option value={data.id} key={data.id}>{data.label}</option>));
            //setDefaultRoles(response.data[0].fonctions.map(data => parseInt(/[^/]*$/.exec(data)[0])))
        })
        Api.get(`/roles`)
        .then((response) => {
            setRoles(response.data.map(data => <option value={data.id} key={data.id}>{data.name}</option>));
        })
        searchPerson(search)
    }, [search]);

    let usersList = [];
    const searchUser = (e) => {
        if (e.target.value !== '')
        {
            usersList = users.filter(user => user.firstName.toLowerCase().startsWith(e.target.value) || user.lastName.toLowerCase().startsWith(e.target.value));
        }
    }   
    return (
    <>
        <div className="container my-5">
            <h1>Création d'un événement</h1>

            <div className="my-5">
                <Formik
                    enableReinitialize
                    initialValues={{ start: "", end: "", title: "", category: "", description: "", roles: defaultRoles, invitedPersons: [], isVisible: true, linkedStructures: '' }}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="col">
                            <div className="row">
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
                            </div>

                            <div className="row my-3">
                                <div className="col-6">
                                    <label htmlFor="firstName">Titre</label>
                                    <Field type="text" name="title" placeholder="titre" className="form-control" />
                                    <ErrorMessage name="title" component="div" className="error-form" />
                                </div>

                                <div className="col-6 form-group">
                                    <label htmlFor='category'>Catégorie</label>
                                    <Field as="select" name="category" className="form-select" onClick={defaultRole}>
                                        <option value='0'>Choisissez une catégorie</option>
                                        {categories}
                                    </Field>
                                    <ErrorMessage className="error-message" name="category" component="div" />
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

                            <div class="row my-3">
                                <div className="col-6 form-group">
                                    <label htmlFor='roles'>Roles invités</label>
                                    <Field as="select" name="roles" className="form-select" multiple>
                                        {roles}
                                    </Field>
                                    <ErrorMessage className="error-message" name="roles" component="div" />

                                    <div className="my-3">
                                        <div className='form-check'>
                                            <Field className="input-field form-check-input" type="checkbox" name="status"/>
                                            <label className="form-check-label" htmlFor='status'>Est visible à tous ?</label>
                                        </div>

                                        <button type="submit" className="btn btn-light col-auto my-2">
                                            Envoyer
                                        </button>
                                    </div>
                                </div>

                                <div className="col-6 d-grid justify-item-end">
                                    <label htmlFor="person">Personnes invitées</label>
                                    <input type="text" name="person" placeholder="titre" className="form-control" onChange={searchUser}/>
                                    <div className="input-group">
                                        <Field multiple dataLiveSearch as="select" name="invitedPersons" className="form-select" onClick={getGuests}>
                                            {users && users.map(user => {
                                                return (
                                                    <option value={user.id} key={user.id}>{user.lastName} {user.firstName}</option>
                                                )
                                            })}
                                        </Field>
                                    </div>

                                    { guests === '' ? '' : guests &&
                                        <div className="table-responsive-xxl my-3">
                                            <Table hover striped>
                                                <thead>
                                                    <tr>
                                                        <th>Invités sélectionner</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        guests.map((guest, index) => {
                                                            return (
                                                                <tr onClick={() => deleteGuest(index)}>
                                                                    <td>{guest}{index}</td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                </tbody>
                                            </Table>
                                        </div>
                                    }
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    </>
    )
}
