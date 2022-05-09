import './App.scss';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/LoginForm/Login';
import AddUser from './components/AddUser';
import FunctionAccreditation from './components/FunctionAccreditation/FunctionAccreditation';
import RolesList from './components/RolesList/RoleList';
import 'bootstrap/dist/css/bootstrap.min.css';
import CategoryList from './components/Category/CategoryList';
import CategoryAdd from './components/Category/CategoryAdd';
import CategoryEdit from './components/Category/CategoryEdit';
import ConnectedHomepage from './components/ConnectedHomepage/ConnectedHomepage';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

function App() {
  return (
    <>
      <Navbar bg="light" expand="" className="border-bottom border-purple mb-5">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
      </Navbar>

    <BrowserRouter>
      <Routes>
        { localStorage.getItem("token") === null && <Route path="/" element={<Login />} /> }
        { localStorage.getItem("token") && <Route path="/" element={<ConnectedHomepage />} /> }
        <Route path="/user/add" element={<AddUser />} />
        <Route path="/roles" element={<RolesList />} />
        <Route path="/roles/accreditation/:id" element={<FunctionAccreditation />} />
        <Route path="/event-categories" element={<CategoryList />} />
        <Route path="/event-categories/add" element={<CategoryAdd />} />
        <Route path="/event-categories/edit/:id" element={<CategoryEdit />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
