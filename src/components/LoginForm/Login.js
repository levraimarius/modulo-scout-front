import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Container } from "react-bootstrap";

const baseURL = "api/auth-token";

export default function Login() {
    const [error, setError] = useState(null);

    const handleSubmit = (values) => {
        axios
            .post(baseURL, {uuid: values.uuid.toString(), password: values.password})
            .then((response) => {
                localStorage.setItem("token", response.data.token)
                window.location.href = "/";
            })
            .catch(err => {
                setError(err.response.data.message);
            });
    };

    const validate = (values) => {
        const errors = {};
      
        if (!values.uuid) {
          errors.uuid = "Veuillez saisir un numéro d'adhérant valide.";
        }

        if (!values.password) {
          errors.password = "Mot de passe incorrect.";
        }
      
        return errors;
      };
    return (
    <>
        <Container>
            <h1 className="d-flex justify-content-center mb-5">Bienvenue sur Modulo !</h1>
            <Formik
                enableReinitialize
                initialValues={{ uuid: "", password: "" }}
                onSubmit={handleSubmit}
                validate={validate}
            >
                {({ isSubmitting }) => (
                    <Form className="col g-1">
                        <div className="col-6">
                            <label htmlFor="firstName">N°adhérent</label>
                            <Field type="number" name="uuid" placeholder="N°adhérent" className="form-control" />
                            <ErrorMessage name="uuid" component="div" className="error-form" />
                        </div>

                        <div className="col-6">
                            <label htmlFor="firstName">Mot de passe</label>
                            <Field type="password" name="password" placeholder="Mot de passe" className="form-control" />
                            <ErrorMessage name="password" component="div" className="error-form" />
                        </div>
                        {error && <div className="error-form">{error}</div>}
                        <button type="submit" disabled={isSubmitting} className="btn btn-light col-auto my-3">
                            Envoyer
                        </button>
                    </Form>
                )}
            </Formik>
        </Container>
    </>
    )
}