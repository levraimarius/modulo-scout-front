import React, { useEffect, useState } from 'react';
import axios from "axios";

const baseURL = "api/auth-token";

export default function Login() {
    const [datas, setDatas] = useState({
        uuid: null,
        password: null
    });


    const handleSubmit = e => {
        e.preventDefault();

        setDatas({
            uuid: e.target.uuid.value,
            password: e.target.password.value
        })

        axios
          .post(baseURL, datas)
          .then((response) => {
            localStorage.setItem('token', response.data.token)
          })
          .catch(err => {
              console.log(err);
          });
    }

    return (
    <>
        <div>
        <h1>Connection</h1>
        <form onSubmit={handleSubmit}>
            <label>Uuid</label>
            <input type='number' name='uuid'></input>

            <label>Password</label>
            <input type='text' name='password'></input>
            <button>Connexion</button>
        </form>
        </div>
    </>
    )
}