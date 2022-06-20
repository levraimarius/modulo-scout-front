import React, { useEffect, useState } from 'react';
import axios from "axios";
import Api from "../Api"
import jwt from 'jwt-decode'
import Scope from './Scope';

export default function ScopeChoice(props) {
    const [scopes, setScopes] = useState([]);
    const [roles, setRoles] = useState([]);
    const [structures, setStructures] = useState([]);
    const tabScopes = [];

    useEffect(() => {
        props.user && setScopes(props.user.scope)
    }, [props]);

    return (
    <>  
        <div>Choisissez votre scope</div>
        {scopes && scopes.map(scope => 
            <Scope structure={scope.structure.id} role={scope.role.id} id={scope.id} key={scope.id} />
        )}
    </>
    )
}