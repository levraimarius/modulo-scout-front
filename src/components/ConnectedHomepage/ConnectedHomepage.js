import React, { useEffect, useState }from 'react';
import ScopeChoice from '../Scope/ScopeChoice';
import Api from "../Api";

export default function ConnectedHomepage() {
    const currentScope = localStorage.getItem("currentScope");

    return (
    <>
        <div className='container'>
            <h1>Connected Homepage</h1>
            <div>
                {currentScope &&
                    <>
                        <h3>Scope actuel :</h3>
                        <div>{currentScope}</div>
                    </>
                }
            </div>
        </div>
    </>
    )
}