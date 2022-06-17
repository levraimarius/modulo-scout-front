import * as Yup from "yup";
import Api from "../Api";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useState, useEffect } from "react";
import bcrypt from "bcryptjs";
import Alert from "../Alert";

const salt = bcrypt.genSaltSync(10)

export default function FormUsers(props) {
    const   [alert, setAlert] = useState(false),
            [status, setStatus] = useState(''),
            [message, setMessage] = useState(""),
            [loadingStructure, setLoadingStructure] = useState(true),
            [loadingRole, setLoadingRole] = useState(true),
            [structures, setStrucures] = useState(),
            [roles, setRoles] = useState(),
            user = props.user

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
            <h2 className="text-primary mb-4 desktop">Ajout d'un administrateur</h2>

            { 
                alert && <Alert status={status} message={message}/> 
            }

            <Formik
                initialValues={{ lastName: "", firstName: "", adherentNumber: "", email: "", gender: "", scopes: [{ structure: '', role: ''}] }}
                enableReinitialize={true}
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
                    values.scopes.forEach(scope => {
                        scope.structure = `/api/structures/${scope.structure}`
                        scope.role = `/api/roles/${scope.role}`
                    })

                    Api.post('users', {
                        "uuid": values.adherentNumber,
                        "email": values.email,
                        "password": bcrypt.hashSync('password', salt),
                        "firstName": values.firstName,
                        "lastName": values.lastName,
                        "genre": values.gender,
                        "scope": values.scopes,
                        "roles": ['ROLE_ADMIN']
                    })
                    .then(res => {
                        const st = JSON.stringify(res.status)

                        if (st === '201') {
                            document.getElementById('form-add-user').reset()
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
                }}
            >
                {({ isSubmitting, values, errors }) => (
                    <Form id="form-add-user">
                        <div className="desktop">
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
                        </div>


                        <div className="mobile">
                            <div className="form-group mb-2">
                                <label htmlFor="lastName">Nom</label>
                                <Field type="text" name="lastName" className={`form-control ${errors.lastName && 'border-danger'}`} placeholder="Dupont" autoFocus />
                                <ErrorMessage name="lastName" component="div" className="text-danger" />
                            </div>

                            <div className="form-group mb-2">
                                <label htmlFor="firstName">Prénom</label>
                                <Field type="text" name="firstName" className={`form-control ${errors.firstName && 'border-danger'}`} placeholder="Jean" />
                                <ErrorMessage name="firstName" component="div" className="text-danger" />
                            </div>

                            <div className="form-group mb-2">
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

                            <div className="form-group mb-2">
                                <label htmlFor="adherentNumber">Numéro d'adhérent</label>
                                <Field type="text" name="adherentNumber" className={`form-control ${errors.adherentNumber && 'border-danger'}`} placeholder="123456789" />
                                <ErrorMessage name="adherentNumber" component="div" className="text-danger" />
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
                                                    <div className="mb-3" key={index}>
                                                        <div className="form-group mb-2">
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

                                                        <div className="d-flex">
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
                        </div>

                        <button type="submit" className="btn btn-primary">Valider</button>
                    </Form>
                )}
            </Formik>
        </>
    )
}
