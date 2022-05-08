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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user/add" element={<AddUser />} />
        <Route path="/roles" element={<RolesList />} />
        <Route path="/roles/accreditation/:id" element={<FunctionAccreditation />} />
        <Route path="/event-categories" element={<CategoryList />} />
        <Route path="/event-categories/add" element={<CategoryAdd />} />
        <Route path="/event-categories/edit/:id" element={<CategoryEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
