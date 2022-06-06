import * as Yup from "yup";
import Api from "../Api";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10)

export default function FormUsers() {
    const   [alert, setAlert] = useState(false),
            [status, setStatus] = useState(),
            [message, setMessage] = useState(),
            [loadingStructure, setLoadingStructure] = useState(true),
            [loadingRole, setLoadingRole] = useState(true),
            [structures, setStrucures] = useState(),
            [roles, setRoles] = useState()

    
    /**
     * Get all the structures
     */
     const getStructures = () => {
        Api.get("structures?pagination=false")
        .then(res => {
            const status = res.status

            if (status === 200) {
                setStrucures(res.data)
                setLoadingStructure(false)
            } else {
                console.log(`Status HTTP : ${status}`);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    /**
     * Get all the roles
     */
    const getRoles = () => {
        Api.get("roles?pagination=false")
        .then(res => {
            const status = res.status

            if (status === 200) {
                setRoles(res.data)
                setLoadingRole(false)
            } else {
                console.log(`Status HTTP : ${status}`);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getStructures()
        getRoles()
    }, [])

    return (
        <>
            <h2 className="text-primary mb-4">Ajout d'un administrateur</h2>

            { alert && Alert(status, message) }

            <Formik
                initialValues={{ lastName: "", firstName: "", adherentNumber: "", email: "", gender: "", scopes: [{ structure: '', role: ''}] }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={
                    Yup.object({
                        firstName: Yup.string()
                            .required('Champ requis')
                            .max(255, 'Le prénom ne peut pas excéder 255 caractères'),
                        lastName: Yup.string()
                            .required('Champ requis')
                            .max(255, 'Le nom ne peut pas excéder 255 caractères'),
                        gender: Yup.string()
                            .required('Champ requis'),
                        adherentNumber: Yup.string()
                            .required('Champ requis')
                            .max(96, 'Le numéro d\'ahérent ne peut pas excéder 96 caractères'),
                        email: Yup.string()
                            .email('Le format est invalide')
                            .required('Champ requis'),
                        scopes: Yup.array()
                            .of(
                                Yup.object().shape({
                                    structure: Yup.string().required('Champ requis'),
                                    role: Yup.string().required('Champ requis')
                                })
                            )
                            .required("L'utilisateur doit au moins être lié à un scope")
                            .max(2, "Maximum 2 scopes peuvent être rattachées à l'utilisateur")
                    })
                }
                onSubmit={(values, { setSubmitting }) => {
                    console.log('test');
                    Api.post('users', {
                        "uuid": values.adherentNumber,
                        "email": values.email,
                        "password": bcrypt.hashSync('password', salt),
                        "firstName": values.firstName,
                        "lastName": values.lastName,
                        "genre": values.gender,
                        "roles": ['ROLE_USER', 'ROLE_ADMIN']
                    })
                    .then(res => {
                        const   status = JSON.stringify(res.status),
                                id = JSON.stringify(res.data.id)

                        if (status === '201') {
                            values.scopes.forEach((scope, index) => {
                                Api.post('scopes', {
                                    "user": `/api/users/${id}`,
                                    "structure": `/api/structures/${scope.structure}`,
                                    "role": `/api/roles/${scope.role}`,
                                    "active": true
                                })
                                .then(res => {
                                    const status = JSON.stringify(res.status)

                                    if (status === '201') {
                                        index === (values.scopes.length - 1) && document.getElementById('form-add-user').reset()
                                        setAlert(true)
                                        setStatus('success')
                                        setMessage("L'utilisateur a bien été enregistré")
                                    } else {
                                        setAlert(true)
                                        setStatus('danger')
                                        setMessage(`Une erreur est survenue lors de l'enregistrement du scope. (Code erreur : ${status}`)
                                    }
                                })
                                .catch(err => {
                                    setAlert(true)
                                    setStatus('danger')
                                    setMessage(`Une erreur est survenue lors de l'enregistrement du scope. (Erreur : ${err}`)
                                })
                            })
                        } else {
                            setAlert(true)
                            setStatus('danger')
                            setMessage(`Une erreur est survenue lors de l'enregistrement du scope. (Code erreur : ${status}`)
                        }
                    })
                    .catch(err => {
                        setAlert(true)
                        setStatus('danger')
                        setMessage(`Une erreur est survenue lors de l'enregistrement du scope. (Erreur : ${err}`)
                    })
                    setSubmitting(false)
                }}
            >
                {({ isSubmitting, values, errors }) => (
                    <Form id="form-add-user">
                        <div className="row mb-3">
                            <div className="col form-group">
                                <label htmlFor="lastName">Nom</label>
                                <Field type="text" name="lastName" className={`form-control ${errors.lastName && 'border-danger'}`} placeholder="Dupont" />
                                <ErrorMessage name="lastName" component="div" className="text-danger" />
                            </div>

                            <div className="col form-group">
                                <label htmlFor="firstName">Prénom</label>
                                <Field type="text" name="firstName" className={`form-control ${errors.firstName && 'border-danger'}`} placeholder="Jean" />
                                <ErrorMessage name="firstName" component="div" className="text-danger" />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col form-group">
                                <div id="label-gender">Genre</div>
                                <div role="group" aria-labelledby="label-gender" className="d-flex justify-content-evenly">
                                    <div className="form-check">
                                        <Field type="radio" id="man" name="gender" value="H" className={`form-check-input ${errors.gender && 'border-danger'}`} />
                                        <label className="form-check-label" htmlFor="man">Homme</label>
                                    </div>
                                    <div className="form-check">
                                        <Field type="radio" id="woman" name="gender" value="F" className={`form-check-input ${errors.gender && 'border-danger'}`} />
                                        <label className="form-check-label" htmlFor="woman">Femme</label>
                                    </div>
                                </div>
                                <ErrorMessage name="gender" component="div" className="text-danger" />
                            </div>

                            <div className="col form-group">
                                <label htmlFor="adherentNumber">Numéro d'adhérent</label>
                                <Field type="text" name="adherentNumber" className={`form-control ${errors.adherentNumber && 'border-danger'}`} placeholder="123456789" />
                                <ErrorMessage name="adherentNumber" component="div" className="text-danger" />
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label htmlFor="email">Adresse mail</label>
                            <Field type="text" name="email" className={`form-control ${errors.email && 'border-danger'}`} placeholder="adresse@mail.fr" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>

                        <FieldArray name="scopes">
                            {({ insert, remove, push }) => (
                                <div>
                                    <div className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary mb-3" onClick={() => values.scopes.length < 2 && push({ structure: '', role: '' })}>
                                            Ajouter un scope
                                        </button>
                                    </div>

                                    {
                                        values.scopes.length > 0 &&
                                            values.scopes.map((scope, index) => (
                                                <div className="row mb-3" key={index}>
                                                    <div className="col form-group">
                                                        <label htmlFor={`scopes.${index}.structure`}>Structure</label>
                                                        <Field name={`scopes.${index}.structure`} className={`form-control ${errors.scopes && errors.scopes[index].structure && "border-danger"}`} as="select">
                                                            <option value="" disabled>Choisissez une structure</option>
                                                            {
                                                                !loadingStructure && structures.map(structure => {
                                                                    return <option value={structure.id} key={structure.id}>{structure.name}</option>
                                                                })
                                                            }
                                                        </Field>
                                                        <ErrorMessage name={`scopes.${index}.structure`} component="div" className="text-danger" />
                                                    </div>

                                                    <div className="col d-flex flex-row">
                                                        <div className="flex-fill">
                                                            <label htmlFor={`scopes.${index}.role`}>Fonction</label>
                                                            <Field name={`scopes.${index}.role`} className={`form-control ${errors.scopes && errors.scopes[index].role && "border-danger"}`} as="select">
                                                                <option value="" disabled>Choisissez une fonction</option>
                                                                {
                                                                    !loadingRole && roles.map(role => {
                                                                        return <option value={role.id} key={role.id}>{role.name}</option>
                                                                    })
                                                                }
                                                            </Field>
                                                            <ErrorMessage name={`scopes.${index}.role`} component="div" className="text-danger" />
                                                        </div>

                                                        {
                                                            values.scopes.length > 1 && <button type="button" className={`btn btn-danger align-self-${errors.scopes && errors.scopes[index] ? 'center' : 'end'} ms-3`} onClick={() => remove(index)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                                                                <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                                                                <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                                                            </svg>
                                                        </button>
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                    }
                                </div>
                            )}
                        </FieldArray>

                        <button type="submit" className="btn btn-primary">Valider</button>
                    </Form>
                )}
            </Formik>
        </>
    )
}


function Alert(status, message) {
    return (
        <Alert variant={status}>
            <p className="m-0">
                {
                    status === 'success' ? 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill me-1" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                    :
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg> 
                }
                {message}
            </p> 
        </Alert>
    )
}