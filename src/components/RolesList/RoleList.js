import React, { useEffect, useState } from 'react';
import axios from "axios";
import Api from "../Api"
import Scope from "../Scope/Scope";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
  } from "react-router-dom";

const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function FunctionAccreditation() {
    const [roles, setRoles] = useState(null);

    useEffect(() => {
        Api.get('/roles')
        .then((response) => {
            setRoles(response.data)
        })
        .catch(err => {
            setRoles('Une erreur est survenue, veuillez réessayer plus tard.')
        });
    }, []);

    const options = {
        headers: {"Authorization": `Bearer ${token}`}
    }
    console.log(roles)
    return (
    <>
        <div className="container mt-5 test">
            <h1>Habilitation des fonctions</h1>
            <div>
                {!roles && "Aucun scope disponible"}
                <table className="table">
                    <thead className="thead-light"></thead>
                    <tbody>
                        {roles && roles.map(role => (
                            <>
                            <tr>
                                <th scope="row">{role.id}</th>
                                <td>{role.name}</td>
                                <td><Link to={`/roles/accreditation/${role.id}`} className="btn btn-primary">Modifier les habilitations</Link></td>
                            </tr>
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
    )
}