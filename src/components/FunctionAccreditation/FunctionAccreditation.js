import React, { useEffect, useState } from 'react';
import axios from "axios";
import Api from "../Api"
import Scope from "../Scope/Scope";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams
} from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import ListItem from '../ListItem/ListItem';

const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function FunctionAccreditation() {
    const [accreditations, setAccreditation] = useState(null);
    const [role, setRole] = useState(null);
    const [input, setInput] = useState('');
    const [pastAccreditations, setPastAccreditation] = useState('');
    let accreditationIds = [];
    let checkedAccreditations = [];
    const [checked, setChecked] = useState([]);
    
    let { id } = useParams();
    
    useEffect(() => {
        Api.get('/accreditations')
        .then((response) => {
            setAccreditation(response.data)
        })

        Api.get(`/roles/${id}`)
        .then((response) => {
            setRole(response.data);
            let test = [];
            setChecked(response.data.accreditations.map(accreditation => accreditation.id))
        })

    }, []);
    
    role && role.accreditations.map(accreditation => {
        const accreditationId = /[^/]*$/.exec(accreditation)[0];
        accreditationIds.push(parseInt(accreditationId));
        //checkedAccreditations.push(accreditation);
        //setChecked({[parseInt(accreditationId)]: true})
    })
    const handleChange = (accreditation, value, e) => {
        if (checked.indexOf(accreditation) === -1) {
            setChecked([...checked, accreditation])
        } else {
            const index = checked.indexOf(accreditation)
            checked.splice(index, 1)
        }

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(checked.map(accreditation => accreditation))
        Api.put(`roles/${id}`, {
            accreditations: checked.map(accreditation => (`/api/accreditations/${accreditation}`)),
        })
        .then((response) => {window.location.href = "/roles"})
    }
    return (
    <>
        <div className="container mt-5">
            <h1>Habilitations</h1>
            <div>
                <form onSubmit={handleSubmit}>
                    {!accreditations ? "Aucune fonction disponible" :
                    <table className="table">
                        <thead className="thead-light"></thead>
                        <tbody>
                            {accreditations && accreditations.map((accreditation)=> (
                                <>
                                <ListItem state={checked} selected={handleChange} content={accreditation.name} id={accreditation.id}></ListItem>
                            </>
                            ))}
                        </tbody>
                    </table>
                    }
                    <input type="submit" value="Valider" className='btn btn-success' />
                </form>
            </div>
        </div>
    </>
    )
}