import React, { useEffect, useState, useCallback, useContext } from 'react';
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
import { Icon } from '@iconify/react';
import './_searchSelect.scss';
import { searchRole, searchUser } from '../Events/Utils';
import { array } from 'yup/lib/locale';

const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function SearchSelect(props) {
    const [items, setItems] = useState([]);
    const [itemList, setItemList] = useState();

    const updateItem = (itemId) => {
        const newItem = props.defaultItem.filter(item => item.id !== itemId);
        props.setDefaultItem(newItem);
        setItems(items);
    }
    
    useEffect(() => {
        Api.get(`/${props.search}${props.search === 'users' ? '?pagination=false' : ''}`)
        .then((response) => {
            setItems(response.data);
        })

        props.defaultItem && props.setDefaultItem(props.defaultItem)
    }, [props.defaultItem]);

    const searchItem = (e) => {
        let newItemList = null;
        if (e.target.value !== '') {
            //check if role is already in defaultRoles
            props.search === 'roles' ? setItemList(searchRole(e, props.defaultItem, items) ): setItemList(searchUser(e, props.defaultItem, items));
        }
    }

    const searchUser = (e, defaultItem, items) => {
        let newItemList = items.filter(item => item.lastName.toLowerCase().startsWith(e.target.value) || item.firstName.toLowerCase().startsWith(e.target.value));
        return newItemList;
    }
    
    const searchRole = (e, defaultItem, items) => {
        let newItemList = items.filter(item => item.name.toLowerCase().startsWith(e.target.value));
        
        return newItemList;
    }

    const selectItem = (item) => {
        console.log(item);
        if (props.defaultItem) {
            props.setDefaultItem([...props.defaultItem, item])
        }
        else {
            props.setDefaultItem(item);
        }
    }

    console.log(props.defaultItem)
    return (
        <>
            <label htmlFor='roles'>{props.name}</label>
            <div className='select-container'>
                <div className='select'>
                    <input type="text" name="roles" className="form-control search-select" onChange={searchItem}>
                    </input>
                    {itemList && itemList.map(item => {
                        return (
                        props.defaultItem && props.defaultItem.some((e) => Object.entries(e).toString() === Object.entries(item).toString()) 
                        ? <div className='selected-item' key={`${item.id}`} onClick={() => updateItem(item.id)}>{props.search === 'roles' && item.name}{props.search === 'users' && item.firstName} {props.search === 'users' && item.lastName}</div> 
                        : <div key={`${item.id}`} onClick={() => selectItem(item)}>{props.search === 'roles' && item.name}{props.search === 'users' && item.firstName} {props.search === 'users' && item.lastName}</div>)
                    })}
                </div>
                <div className='selected'> 
                    {props.defaultItem && props.defaultItem.map(item => {
                        return (
                            <div className='badge' key={item.id} onClick={() => updateItem(item.id)}>{props.search === 'roles' && item.name}{props.search === 'users' && item.firstName} {props.search === 'users' && item.lastName}</div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}