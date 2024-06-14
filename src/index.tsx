import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.sass';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RecipeListPage } from './components/pages/RecipeListPage';
import { RecipePage } from './components/pages/RecipePage';
import { AddRecipePage } from './components/pages/AddRecipePage';
import { EditRecipePage } from './components/pages/EditRecipePage';
import { MainPage } from './components/pages/MainPage';
import {SignUpPage} from "./components/pages/SignUpPage";
import {LoginPage} from "./components/pages/LoginPage";

const root = ReactDOM.createRoot(
    document.getElementById('react-page-root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <RouterProvider
          router={createBrowserRouter([
                {
                    path: '/',
                    element: <MainPage />,
                },
                {
                  path: '/sign-up',
                  element: <SignUpPage />,
                },
                {
                  path: '/sign-in',
                  element: <LoginPage />,
                },
                {
                    path: '/recipes',
                    element: <RecipeListPage />,
                },
                {
                    path: '/recipe/:id/:name',
                    element: <RecipePage />,
                },
                {
                    path: '/create-recipe',
                    element: <AddRecipePage />,
                },
                {
                    path: '/edit-recipe',
                    element: <EditRecipePage />,
                },
            ])}
        />
    </React.StrictMode>,
);
