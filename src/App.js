import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/LoginForm/Login';
import AddUser from './components/AddUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/user/add" element={<AddUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
