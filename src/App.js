import './App.scss';
import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import Login from './components/LoginForm/Login';
import FunctionAccreditation from './components/FunctionAccreditation/FunctionAccreditation';
import ListEvents from './components/Events/ListEvents';
import AddEvents from './components/Events/AddEvents';
import EditEvents from './components/Events/EditEvents';
import RolesList from './components/RolesList/RoleList';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryList from './components/Category/CategoryList';
import CategoryAdd from './components/Category/CategoryAdd';
import CategoryEdit from './components/Category/CategoryEdit';
import ConnectedHomepage from './components/ConnectedHomepage/ConnectedHomepage';
import ScopeChoice from './components/Scope/ScopeChoice';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import Api from "./components/Api";
import jwt from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import ListUsers from './components/Users/ListUsers';
import Agenda from './components/Agenda/Agenda';
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
    localStorage.clear()
    window.location.href = "/login"
  }

  const isConnected = () => {
    return currentUser !== null ? true : false;
  }

  const isAdmin = () => {
    if (isConnected() && currentUser.roles.includes('ROLE_ADMIN')){
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      <Navbar colapseonselect bg="light" expand="lg" sticky='top' className="border-bottom border-purple mb-5">
        <Container className='m-0'>
          <Navbar.Brand href="/">Modulo</Navbar.Brand>
          <Navbar.Toggle aria-controls='responsive-navbar-nav' />
          <Navbar.Collapse id="responsive-navbar-nav">
              {
                token &&
                <Nav className='me-auto'>
                  <Nav.Link href="/" className={window.location.pathname === '/' && 'active'}>Accueil</Nav.Link>
                  <Nav.Link href="/scope-choice" className={window.location.pathname === '/scope-choice' && 'active'}>Choix du scope</Nav.Link>
                  <Nav.Link href="/agenda" className={window.location.pathname === '/agenda' && 'active'}>Agenda</Nav.Link>
                  {
                    isAdmin() &&
                      <NavDropdown title="Backoffice" id="basic-nav-dropdown">
                        <NavDropdown.Item href='/event-list'>Liste des événements</NavDropdown.Item>
                        <NavDropdown.Item href='/roles'>Roles</NavDropdown.Item>
                        <NavDropdown.Item href='/event-categories'>Catégories d'événements</NavDropdown.Item>
                        <NavDropdown.Item href='/users'>Gestion des utilisateurs</NavDropdown.Item>
                      </NavDropdown>
                  }
                  <Nav.Link onClick={() => { 
                    localStorage.clear()
                    window.location.href = "/login"
                  }}>Déconnexion</Nav.Link>
                </Nav>
              }
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <BrowserRouter>
        <Routes>
          { (localStorage.getItem("token") === null && localStorage.getItem("currentScope")) === null && <Route path="/" element={<Login />} /> }
          { (localStorage.getItem("token") && localStorage.getItem("currentScope") !== null) && <Route path="/" element={<ConnectedHomepage />} /> }
          { (localStorage.getItem("token") && localStorage.getItem("currentScope") === null) && <Route path="/" element={<ScopeChoice user={user} />} /> }
          <Route path="/event-list" element={isAdmin() ? <ListEvents /> : <Navigate to="/" />}/>
          <Route path="/event-list/add"  element={isAdmin() ? <AddEvents /> : <Navigate to="/" />} />
          <Route path="/event-list/edit/:id" element={isAdmin() ? <EditEvents /> : <Navigate to="/" />} />
          <Route path="/roles" element={isAdmin() ? <RolesList /> : <Navigate to="/" />}/>
          <Route path="/roles/accreditation/:id" element={isAdmin() ? <FunctionAccreditation /> : <Navigate to="/" />} />
          <Route path="/event-categories" element={isAdmin() ? <CategoryList /> : <Navigate to="/" />} />
          <Route path="/event-categories/add"  element={isAdmin() ? <CategoryAdd /> : <Navigate to="/" />} />
          <Route path="/event-categories/edit/:id" element={isAdmin() ? <CategoryEdit /> : <Navigate to="/" />} />
          <Route path="/scope-choice" element={<ScopeChoice user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={isAdmin() ? <ListUsers /> : <Navigate to="/" />} />
          <Route path="/agenda" element={isConnected ? <Agenda user={user} /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
