import axios from 'axios';
import settings from '../settings';

const fetch = axios.create({
    baseURL: settings.backendURI,
    validateStatus: () => true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export { fetch };
