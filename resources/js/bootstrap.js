import axios from 'axios';
window.axios = axios;

// This is the fix - makes Axios use same protocol as current page
window.axios.defaults.baseURL = window.location.origin;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Optional: Add some debug logging
if (import.meta.env.DEV) {
    console.log('Axios configured with baseURL:', window.axios.defaults.baseURL);
}