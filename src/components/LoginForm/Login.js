import React from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import Api from "../Api"
const baseURL = "api/auth-token";

export default function Login() {
    const handleSubmit = (values) => {
        axios
            .post(baseURL, datas)
            .then((response) => {
            localStorage.setItem('token', response.data.token)
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
    <>
        <Container>
            <h1 className="d-flex justify-content-center mb-5">Bienvenue sur Modulo !</h1>
            <Formik
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