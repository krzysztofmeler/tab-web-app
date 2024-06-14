import axios from 'axios';
import settings from '../settings';

const fetch = axios.create({
    baseURL: settings.backendURI,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { fetch };
