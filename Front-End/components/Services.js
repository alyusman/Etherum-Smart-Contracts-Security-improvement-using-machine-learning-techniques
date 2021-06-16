import axiosMain from "axios";
import cookie from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API;

const LOGIN = "user/login";
const REGISTER = "user/register";
const CREATE_TEST = "user/createTest";
const DASH = "user/dashboard";
const ADMIN_DASH = "admin/dashboard"
const USERS = "admin/allUsers"
const PROCESS_USER = "admin/processActivation"
const USERS_TESTS = "user/getTests"
const ADMIN_TESTS = "admin/allTests"

const axios = axiosMain.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${cookie.get("accessToken")}`
    }
});

axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${cookie.get("accessToken")}`;
    return config;
});

const register = body => {
    return axios.post(REGISTER, body);
}
const login = body => {
    return axios.post(LOGIN, body);
}


const createTest = body => {
    return axios.post(CREATE_TEST, body);
}
const processUser = body => {
    return axios.post(PROCESS_USER, body);
}
const dash = () => {
    return axios.get(DASH);
}
const adminDash = () => {
    return axios.get(ADMIN_DASH);
}
const users = () => {
    return axios.get(USERS);
}
const userTests = () => {
    return axios.get(USERS_TESTS);
}
const adminTests = () => {
    return axios.get(ADMIN_TESTS);
}

export default {
    register,
    login,
    createTest,
    processUser,
    dash,
    adminDash,
    users,
    userTests,
    adminTests,
}