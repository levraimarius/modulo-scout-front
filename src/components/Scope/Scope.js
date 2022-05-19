import React, { useEffect, useState } from 'react';
import axios from "axios";
import Api from "../Api"
import jwt from 'jwt-decode'
import './_scope.scss';

export default function Scope(props) {
    const [structure, setStructure] = useState(null);
    const [role, setRole] = useState(null);

    const getId = (string) => {
        return /[^/]*$/.exec(string)[0]
    }

    useEffect(() => {
        Api.get(`/structures/${getId(props.structure)}`)
        .then((response) => {
            setStructure(response.data)
        })

        Api.get(`/roles/${getId(props.role)}`)
        .then((response) => {
            setRole(response.data)
        })
    }, [props]);

    const setScope = (id, structureId, structureName, roleId, roleName) => {
        localStorage.setItem("currentScope", JSON.stringify([[structureId, structureName], [roleId, roleName]]));
        window.location.href = "/";
    }

    return (
        <>  
            {(structure && role) && <div className='scope-card' onClick={() => setScope(props.id, structure.id, structure.name, role.id, role.name)}>{structure.name} - {role.name}</div>}
        </>
    )
}