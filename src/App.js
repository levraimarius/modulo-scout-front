import './App.scss';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './components/LoginForm/Login';
import FunctionAccreditation from './components/FunctionAccreditation/FunctionAccreditation';
import RolesList from './components/RolesList/RoleList';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryList from './components/Category/CategoryList';
import CategoryAdd from './components/Category/CategoryAdd';
import CategoryEdit from './components/Category/CategoryEdit';
import ConnectedHomepage from './components/ConnectedHomepage/ConnectedHomepage';
import ScopeChoice from './components/Scope/ScopeChoice';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Api from "./components/Api";
import jwt from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import ListUsers from './components/Users/ListUsers';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  let currentUser = null;
  if (token) {
    currentUser = jwt(token)
  }

  useEffect(() => {
    currentUser && Api.get(`/users`)
    .then((response) => {
        setUser(response.data.find(user => user.uuid === currentUser.uuid));
    })
  }, []);

  if (currentUser && currentUser.exp < Date.now() / 1000) {
    localStorage.clear();
  }

  const isAdmin = () => {
    if (currentUser && currentUser.roles.includes('ROLE_ADMIN')){
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <Navbar bg="light" expand="" className="border-bottom border-purple mb-5">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Accueil</Nav.Link>
              <Nav.Link href="/scope-choice">Choix du scope</Nav.Link>
              <Nav.Link onClick={() => localStorage.clear()}>Déconnexion</Nav.Link>
              {isAdmin() &&
                <NavDropdown title="Backoffice" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/roles">Roles</NavDropdown.Item>
                  <NavDropdown.Item href="/event-categories">Catégories d'événements</NavDropdown.Item>
                  <NavDropdown.Item href="/users/:page">Liste utilisateurs</NavDropdown.Item>
                </NavDropdown>
              }
            </Nav>
          </Navbar.Collapse>
      </Navbar>

    <BrowserRouter>
      <Routes>
        { (localStorage.getItem("token") === null && localStorage.getItem("currentScope")) === null && <Route path="/" element={<Login />} /> }
        { (localStorage.getItem("token") && localStorage.getItem("currentScope") !== null) && <Route path="/" element={<ConnectedHomepage />} /> }
        { (localStorage.getItem("token") && localStorage.getItem("currentScope") === null) && <Route path="/" element={<ScopeChoice user={user} />} /> }
        <Route path="/roles" element={isAdmin() ? <RolesList /> : <Navigate to="/" />}/>
        <Route path="/roles/accreditation/:id" element={isAdmin() ? <FunctionAccreditation /> : <Navigate to="/" />} />
        <Route path="/event-categories" element={isAdmin() ? <CategoryList /> : <Navigate to="/" />} />
        <Route path="/event-categories/add"  element={isAdmin() ? <CategoryAdd /> : <Navigate to="/" />} />
        <Route path="/event-categories/edit/:id" element={isAdmin() ? <CategoryEdit /> : <Navigate to="/" />} />
        <Route path="/scope-choice" element={<ScopeChoice user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/:page" element={isAdmin() ? <ListUsers /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
