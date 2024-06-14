import { useEffect, useState } from 'react';
import { NetworkError } from '../errors/types/NetworkError';
import { ResponseError } from '../errors/types/ResponseError';

const useRequest = (input?: RequestInfo | URL, init?: RequestInit) => {
    const [data, _setData] = useState<unknown>(null);
    const [response, _setResponse] = useState<Response | null>(null);
    const [error, _setError] = useState<NetworkError | ResponseError | null>(
        null,
    );
    const [processing, _setProcessing] = useState<boolean>(false);

    useEffect(() => {
        if (input) {
            _setProcessing(true);
            fetch(input, init).then(_setResponse).catch(_setError);
        }
    }, []);

    useEffect(() => {
        if (response) {
            if (response.status > 299) {
                _setError(
                    new ResponseError('Response status is not from 2xx range.'),
                );
            } else if (
                response.headers.get('Content-type') !== 'application/json'
            ) {
                _setError(
                    new ResponseError(
                        'Response content-type is not application/json',
                    ),
                );
            } else {
                response
                    .json()
                    .then(_setData)
                    .catch((jsonError) => {
                        _setError(jsonError);
                    });
            }
        }
    }, [response]);

    useEffect(() => {
        if (!!error || !!response) {
            _setProcessing(false);
        }
    }, [error, response]);

    const send = (input: RequestInfo | URL, init?: RequestInit) => {
        _setProcessing(true);
        fetch(input, init).then(_setResponse).catch(_setError);
    };

    return { data, error, processing, send };
};

export { useRequest };
