import { ErrorMessage, Field, Form, Formik } from "formik";
import Api from "./Api";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10)

export default function AddUser() {
    return(
        <>
            <h1>Ajout d'un administrateur</h1>

            <Formik
                initialValues={{ lastName: "", firstName: "", adherentNumber: "", email: "", gender: "" }}
                validate={values => {
                    const errors = {}

                    if (!values.lastName) {
                        errors.lastName = 'Champs obligatoire'
                    }

                    if (!values.firstName) {
                        errors.firstName = 'Champs obligatoire'
                    }

                    if (!values.email) {
                        errors.email = 'Champs obligatoire'
                    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                        errors.email = 'Format de l\'adresse mail incorrect'
                    }

                    if (!values.gender) {
                        errors.gender = "Champs obligatoire"
                    }
                }}
                onSubmit={(values, { setSubmitting }) => {
                    Api.post('user', {
                        "uuid": values.adherentNumber,
                        "email": values.email,
                        "password": bcrypt.hashSync('password', salt),
                        "first_name": values.firstName,
                        "last_name": values.lastName,
                        "genre": values.gender
                    })
                    .then(res => {
                        const status = JSON.stringify(res.status)

                        if (status === '201') {
                            window.location.reload()
                        } else {
                            console.log(`Status HTTP : ${status}`);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    setSubmitting(false)
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div>
                            <label htmlFor="lastName">Nom</label>
                            <Field type="text" name="lastName" />
                            <ErrorMessage name="lastName" component="div" />
                        </div>

                        <div>
                            <label htmlFor="firstName">Prénom</label>
                            <Field type="text" name="firstName" />
                            <ErrorMessage name="firstName" component="div" />
                        </div>

                        <div>
                            <label htmlFor="adherentNumber">Numéro d'adhérent</label>
                            <Field type="text" name="adherentNumber" />
                            <ErrorMessage name="adherentNumber" component="div" />
                        </div>

                        <div>
                            <div id="label-gender">Genre</div>
                            <div role="group" aria-labelledby="label-gender">
                                <label>
                                    <Field type="radio" name="gender" value="H" />
                                    Homme
                                </label>
                                <label>
                                    <Field type="radio" name="gender" value="F" />
                                    Femme
                                </label>
                            </div>
                        </div>

                        <button type="submit">Valider</button>
                    </Form>
                )}

            </Formik>
        </>
    )
}