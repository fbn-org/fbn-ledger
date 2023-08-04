export default function request(url, data) {
    // fetch password from localstorage
    const password = localStorage.getItem('password');
    data = data || {};
    data.headers = {
        ...data?.headers,
        password: password.replace(/"/g, '')
    };
    return fetch(url, data);
}
