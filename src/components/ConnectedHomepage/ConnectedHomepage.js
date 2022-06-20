import React, { useEffect, useState }from 'react';
import ScopeChoice from '../Scope/ScopeChoice';
import Api from "../Api";

export default function ConnectedHomepage() {
    const [structure, setStructure] = useState();
    const [role, setRole] = useState();
    const currentScope = JSON.parse(localStorage.getItem("currentScope"));

    useEffect(() => {
        Api.get(`/structures/${currentScope[0][0]}`)
        .then((response) => {
            setStructure(response.data.name)
        })

        Api.get(`/roles/${currentScope[1][0]}`)
        .then((response) => {
            setRole(response.data.name)
        })
    }, []);

    return (
    <>
        <div className='container'>
            <h1>Connected Homepage</h1>
            <div>
                {currentScope &&
                    <>
                        <h3>Scope actuel :</h3>
                        <div>{structure && structure} | {role && role}</div>
                    </>
                }
            </div>
        </div>
    </>
    )
}