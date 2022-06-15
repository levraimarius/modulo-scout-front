import React, { useEffect, useState } from 'react';
import axios from "axios";
import Api from "../Api"
import jwt from 'jwt-decode'
import Scope from './Scope';

export default function ScopeChoice(props) {
    const [scopes, setScopes] = useState([]);
    const tabScopes = [];

    useEffect(() => {
        Api.get(`/scopes`)
        .then((response) => {
            response.data.map(scope => scope.user === `/api/users/${props.user.id}` ? tabScopes.push(scope) : '')
            setScopes(tabScopes)
        })
      }, [props]);

    return (
    <>  
        <div>Choisissez votre scope</div>
        {scopes && scopes.map(scope => 
            <Scope structure={scope.structure} role={scope.role} id={scope.id} key={scope.id} />
        )}
    </>
    )
}