import Api from "../Api";
import { useEffect, useState } from "react";
import Loading from "../Tools/Loading";
import { useParams } from "react-router";
import FormUsers from "./FormUsers.js";
import Table from "react-bootstrap/Table";

export default function ListUsers() {
    const   [loading, setLoading] = useState(true),
            [users, setUsers] = useState(),
            [disabled, setDisabled] = useState(false),
            [search, setSearch] = useState(),
            { page } = useParams()

    /**
     * Get 10 users from the database
     */
    const getUsers = (search = undefined) => {
        Api.get((search === '' || search === undefined) ? `users?page=${page}` : `users?page=${page}&lastName=${search}`)
        .then(res => {
            const status = res.status

            if (status === 200) {
                setUsers(res.data)

                /**
                 * Check if the next page has some data (else the next btn from pagination will be disabled)
                 */
                Api.get(`users?page=${parseInt(page) + 1}`)
                .then(res => {
                    res.data.length === 0 && setDisabled(true)
                })
                .catch(err => {
                    console.log(err);
                })

                setLoading(false)
            } else {
                console.log(`Status HTTP : ${status}`)
            }
        })
        .catch(err => {
            console.log(err);
        })
    }


    useEffect(() => {
        getUsers(search)
    }, [search])
    
    return (
        <div className="m-3">
            <h1 className="text-primary mb-5">Gestion des utilisateurs</h1>
            <div className="row p-auto">
                <div className="col-xxl pe-5 mb-5">
                    <div className="row">
                        <div className="col">
                            <h2 className="text-primary mb-4">Liste des utilisateurs</h2>
                        </div>

                        <div className="col d-grid justify-item-end">
                            <div className="input-group mb-2">
                                <input className="form-control" placeholder="Recherche par nom" id="search" onKeyUp={e => setSearch(e.target.value)} />
                                <span className="input-group-text bg-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16" color="white">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>

                    {
                        loading ? <Loading /> : UsersTable(users)
                    }
                </div>

                <div className="col-xxl ps-5">
                    <FormUsers user={""} />
                </div>
            </div>
        </div>
    )
}


function UsersTable(users) {
    const updateUser = user => {
        <FormUsers user={user} />
    }

    const deleteUser = id => {
        Api.delete(`scopes/user/${id}`)
        .then(res => {
            const status = res.status

            if (status === 204) {
                Api.delete(`users/${id}`)
                .then(res => {
                    const status = res.status

                    status !== 204 && console.log(`Status HTTP : ${status}`);
                })
                .catch(err => {
                    console.log(err);
                })
            } else {
                console.log(`Status HTTP : ${status}`);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    return (
        <div className="table-responsive-xxl mt-3">
            <Table hover striped>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Adresse mail</th>
                        <th>N° adhérent</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(user => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.lastName}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.uuid}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={updateUser(user)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                            </svg>
                                        </button>

                                        <button className="btn btn-danger ms-2" onClick={() => deleteUser(user.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div>
    )
}
