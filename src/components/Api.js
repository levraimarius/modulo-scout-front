import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8081/api/",
    headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
})