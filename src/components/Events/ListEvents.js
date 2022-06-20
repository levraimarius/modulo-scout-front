import React, { useEffect, useState } from 'react';
import Api from "../Api";
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";
import { Icon } from '@iconify/react';
import Moment from 'moment';

const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function ListEvents() {
    const [events, setEvents] = useState(null);
    
    useEffect(() => {
        Api.get('/events')
        .then((response) => {
            setEvents(response.data);
        })
    }, []);

    const deleteItem = (id) => {
        Api.delete(`/events/${id}`)
        .then(res => {
            window.location.href = "/event-list"
        });
    }
    
    return (
    <>
        <div className="container mt-5">
            <h1>Liste des événements</h1>
            <Link
                to={{
                    pathname: "/event-list/add",
                }}
            ><button type="button" className="btn btn-success mx-auto">Ajouter un événement</button></Link>
            <div>
                {!events && "Chargement en cours."}
                <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Titre</th>
                        <th scope="col">Description</th>
                        <th scope="col">Dates</th>
                        <th scope="col">Interactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events && events.map(event => (
                            <tr key={event.id}>
                                <th scope="row">{event.id}</th>
                                <td>{event.title}</td>
                                <td><div
                                        dangerouslySetInnerHTML={{__html: event.description}}
                                    />
                                </td>
                                <td>Du {Moment(event.start).format('DD/MM/YYYY HH:mm')} au {Moment(event.end).format('DD/MM/YYYY HH:mm')}</td>
                                <td>
                                    <Link to={`/event-list/edit/${event.id}`} className="btn btn-success"><Icon icon="bxs:edit"/></Link>
                                    <button type="button" className="btn btn-danger" onClick={() => deleteItem(event.id)}><Icon icon="fluent:delete-24-filled"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
    )
}