import React, { useEffect, useState } from 'react';
import Api from "../Api"
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams
} from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import ListItem from '../ListItem/ListItem';
import { Icon } from '@iconify/react';
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { EditorState, convertToRaw, ContentState } from "draft-js";

const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function CategoryList() {
    const [categories, setCategories] = useState(null);
    
    useEffect(() => {
        Api.get('/event_categories')
        .then((response) => {
            setCategories(response.data);
        })
    }, []);

    const deleteItem = (id) => {
        Api.delete(`/event_categories/${id}`)
        .then(res => {
            window.location.href = "/event-categories"
        });
    }
    
    return (
    <>
        <div className="container mt-5">
            <h1>Catégories d'événement</h1>
            <Link
                to={{
                    pathname: "/event-categories/add",
                }}
            ><button type="button" className="btn btn-success">Ajouter</button></Link>
            <div>
                {!categories && "Chargement en cours."}
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Libellé</th>
                        <th scope="col">Description</th>
                        <th scope="col">Interactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories && categories.map(category => (
                            <tr key={category.id}>
                                <th scope="row">{category.id}</th>
                                <td>{category.label}</td>
                                <td><div
                                        dangerouslySetInnerHTML={{__html: category.description}}
                                    />
                                </td>
                                <td><Link to={`/event-categories/edit/${category.id}`} className="btn btn-success"><Icon icon="bxs:edit"/></Link><button type="button" className="btn btn-danger" onClick={() => deleteItem(category.id)}><Icon icon="fluent:delete-24-filled"/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
    )
}