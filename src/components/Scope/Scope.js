import React, { useEffect, useState } from 'react';
import axios from "axios";
import Api from "../Api"

const baseURL = "api/auth-token";
const token = localStorage.getItem('token');

export default function Scope(props) {
    const [user, setUser] = useState(null);
    const [datas, setDatas] = useState(null);
    const [state, setState] = useState({});
    const options = {
        headers: {"Authorization": `Bearer ${token}`}
    }
    //const accreditations = props.datas.accreditation.map((accreditation) => accreditation);

    const urls = [
        props.role,
        props.structure,
    ]

    useEffect(() => {
        axios.all(urls.map((url) => axios.get(url, options))).then(
            (datas) => setDatas(datas)
        );
    }, []);
    console.log(datas)
    return (
    <>  
        <tr>
            <th scope="row">{props.id}</th>
            
            {datas !== null && datas.map(data =>
                <>
                    <td>{data.data.name}</td>
                </>
            )}
            <td>Modifier les Habilitations</td>
        </tr>
    </>
    )
}