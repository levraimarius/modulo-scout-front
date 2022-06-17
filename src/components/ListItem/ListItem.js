import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from "axios";
import Api from "../Api"
import Scope from "../Scope/Scope";
import './_listItem.scss';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useParams
} from "react-router-dom";
import { Formik, Form, Field } from 'formik';
import { Icon } from '@iconify/react';

const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function ListItem(props) {
    const [isSelected, setIsSelected] = useState(false);
    const [show, setShow] = useState(false);
    const onClick = (isSelected, id, value, e) => {
        setIsSelected(isSelected);
        props.selected(id, value, e);
    }
    
    useEffect(() => {
        setIsSelected(props.state.includes(props.id));
    });

    return (
        <>   
            <tr onClick={(e) => onClick(!isSelected, props.id, e.target.checked, e)}>
                <th scope="row">{props.id}</th>
                <td>{props.content}</td>
                <td>
                    { isSelected 
                        ? <button type="button" className="btn btn-outline-info"><Icon icon="charm:tick"/></button>
                        : <button type="button" className="btn btn-outline-dark"><Icon icon="ep:close-bold"/></button>
                    }
                </td>
            </tr>
        </>
    )
}