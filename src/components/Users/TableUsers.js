import Api from "../Api";
import Table from "react-bootstrap/Table";
import useWindowDimensions from "../WindowDimensions";


export default function TableUsers(props) {
    const   users = props.users,
            setUserToUpdate = props.userToUpdate,
            setShow = props.show,
            { height, width } = useWindowDimensions()

    const updateUser = user => {
        setUserToUpdate(user)
        width <= 1031 && setShow(true)
    }

    const deleteUser = id => {
        Api.delete(`users/${id}`)
        .then(res => {
            const status = res.status

            status !== 204 ? console.log(`Status HTTP : ${status}`) : document.getElementById(`user-${id}`).style.display = "none"
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
                        <th className="mobile-list desktop-list">Adresse mail</th>
                        <th className="mobile-list desktop-list">N° adhérent</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(user => {
                            return (
                                <tr id={`user-${user.id}`} key={user.id}>
                                    <td>{user.lastName}</td>
                                    <td>{user.firstName}</td>
                                    <td className="mobile-list desktop-list">{user.email}</td>
                                    <td className="mobile-list desktop-list">{user.uuid}</td>
                                    <td>
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