import Api from "../Api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import FormUsers from "./FormUsers.js";
import TableUsers from "./TableUsers.js";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import './_users.scss';

export default function ListUsers() {
    const   [loading, setLoading] = useState(true),
            [show, setShow] = useState(false),
            [users, setUsers] = useState(),
            [disabled, setDisabled] = useState(false),
            [search, setSearch] = useState(),
            [userToUpdate, setUserToUpdate] = useState(null)

    const handleClose = () => {
        setShow(false)
        setUserToUpdate(null)
    }
    const handleShow = () => setShow(true);

    /**
     * Get 10 users from the database
     */
    const getUsers = (search = undefined) => {
        Api.get((search === '' || search === undefined) ? `users?page=1` : `users?page=1&lastName=${search}`)
        .then(res => {
            const status = res.status

            if (status === 200) {
                setUsers(res.data)

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
        <>
            <div className="m-3 desktop">
                <h1 className="text-primary mb-5">Gestion des utilisateurs</h1>
                <div className="row p-auto">
                    <div className="col pe-5 mb-5">
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
                            !loading && <TableUsers 
                                users={users}
                                userToUpdate={setUserToUpdate}
                                show={setShow}
                            />
                        }
                    </div>

                    <div className="col ps-5">
                        <FormUsers 
                            user={userToUpdate}
                        />
                    </div>
                </div>
            </div>

            <div className="m-3 mobile">
                <h1 className="mb-3">Gestion des utilisateurs</h1>
                <h2 className="mb-3 d-flex justify-content-between">
                    Liste des utilisateurs
                    <Button variant="primary" onClick={handleShow} className="mobile">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-plus-fill" viewBox="0 0 16 16">
                            <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </Button>
                </h2>
                <div className="input-group mb-2">
                    <input className="form-control" placeholder="Recherche par nom" id="search" onKeyUp={e => setSearch(e.target.value)} />
                    <span className="input-group-text bg-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16" color="white">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </span>
                </div>

                {
                    !loading && <TableUsers 
                        users={users}
                        userToUpdate={setUserToUpdate}
                        show={setShow}
                    />
                }

                <Modal 
                    show={show} 
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    className="mobile"
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    scrollable
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">Ajouter un administrateur</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormUsers 
                            user={userToUpdate}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={handleClose}>
                            Fermer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}
