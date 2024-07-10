import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.sass';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createTheme, MantineProvider } from '@mantine/core';
import { RecipeListPage } from './components/pages/RecipeListPage';
import { RecipePage } from './components/pages/RecipePage';
import { AddRecipePage } from './components/pages/AddRecipePage';
import { EditRecipePage } from './components/pages/EditRecipePage';
import { MainPage } from './components/pages/MainPage';
import { SignUpPage } from './components/pages/SignUpPage';
import { LoginPage } from './components/pages/LoginPage';
import { MyProfilePage } from './components/pages/MyProfilePage';
import { Page } from './components/Page';
import { AdministrativeFunctionsPage } from './components/pages/AdministrativeFunctionsPage';
import { TagsPage } from './components/pages/TagsPage';
import {CreateTagPage} from "./components/pages/CreateTagPage";
import {UnitsPage} from "./components/pages/UnitsPage";
import {CreateUnitPage} from "./components/pages/CreateUnitPage";
import {IngredientsPage} from "./components/pages/IngredientsPage";
import {CreateIngredientPage} from "./components/pages/CreateIngredientPage";

const theme = createTheme({
    fontFamily: 'Poppins, Open Sans, sans-serif',
});

const root = ReactDOM.createRoot(
    document.getElementById('react-page-root') as HTMLElement,
);
root.render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <RouterProvider
              router={createBrowserRouter([
                    {
                        path: '/',
                        element: <Page />,
                        children: [
                            {
                                path: '/',
                                element: <MainPage />,
                            },
                            {
                                path: '/sign-up',
                                element: <SignUpPage />,
                            },
                            {
                                path: '/my-profile',
                                element: <MyProfilePage />,
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
                                path: '/add-recipe',
                                element: <AddRecipePage />,
                            },
                            {
                                path: '/edit-recipe',
                                element: <EditRecipePage />,
                            },
                            {
                                path: '/administration',
                                element: <AdministrativeFunctionsPage />,
                            },
                            {
                                path: '/administration/tags',
                                element: <TagsPage />,
                            },
                            {
                                path: '/administration/create-tag',
                                element: <CreateTagPage />,
                            },
                            {
                                path: '/administration/units',
                                element: <UnitsPage />,
                            },
                            {
                                path: '/administration/create-unit',
                                element: <CreateUnitPage />,
                            },
                            {
                                path: '/administration/ingredients',
                                element: <IngredientsPage />,
                            },
                            {
                                path: '/administration/create-ingredient',
                                element: <CreateIngredientPage />,
                            },
                        ],
                    },
                ])}
            />
        </MantineProvider>
    </React.StrictMode>,
);
