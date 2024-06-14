import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.sass';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const root = ReactDOM.createRoot(
    document.getElementById('react-page-root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <RouterProvider
          router={createBrowserRouter([
                {
                    path: '/',
                    element: <h1>Main page</h1>,
                },
            ])}
        />
    </React.StrictMode>,
);
