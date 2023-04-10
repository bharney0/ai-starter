import * as React from "react";
import { lazy } from '@loadable/component';
import { Routes } from "react-router-dom";
import App from "./App";
// import * as RequiredAuthentication from "./components/Account/RequiredAuthentication";

// const loading = () => {
//     return <div />;
// };

const AsyncHome = lazy(() => import(/* webpackChunkName: "Home" */ "./components/Home/Home"));
const AsyncCounter = lazy(() => import(/* webpackChunkName: "Counter" */ "./components/Counter/Counter"));
const AsyncFetchData = lazy(() => import(/* webpackChunkName: "FetchData" */ "./components/WeatherForecast/FetchData"));
const AsyncLayout = lazy(() => import(/* webpackChunkName: "Layout" */ "./components/Layout/Layout"));
const AsyncHomeLayout = lazy(() => import(/* webpackChunkName: "HomeLayout" */ "./components/Layout/HomeLayout"));
const AsyncNotFound = lazy(() => import(/* webpackChunkName: "NotFound" */ "./components/NotFound/NotFound"));
// const AsyncEditProfile = lazy(() => import(/* webpackChunkName: "EditProfile" */ "./components/Profile/EditProfile"));
// const AsyncRegister = lazy(() => import(/* webpackChunkName: "Register" */ "./components/Account/Register"));
// const AsyncSignIn = lazy(() => import(/* webpackChunkName: "SignIn" */ "./components/Account/SignIn"));
// const AsyncForgotPassword = lazy(() => import(/* webpackChunkName: "ForgotPassword" */ "./components/Account/ForgotPassword"));
// const AsyncForgotPasswordConfirmation = lazy(() => import(/* webpackChunkName: "ForgotPasswordConfirmation" */ "./components/Account/ForgotPasswordConfirmation"));
// const AsyncResetPassword = lazy(() => import(/* webpackChunkName: "ResetPassword" */ "./components/Account/ResetPassword"));
// const AsyncResetPasswordConfirmation = lazy(() => import(/* webpackChunkName: "ResetPasswordConfirmation" */ "./components/Account/ResetPasswordConfirmation"));
// const AsyncSignedOut = lazy(() => import(/* webpackChunkName: "SignedOut" */ "./components/Account/SignedOut"));
// const AsyncAccount = lazy(() => import(/* webpackChunkName: "Account" */ "./components/Account/Account"));
// const AsyncChangePassword = lazy(() => import(/* webpackChunkName: "ChangePassword" */ "./components/Account/ChangePassword"));
// const AsyncDeleteAccount = lazy(() => import(/* webpackChunkName: "DeleteAccount" */ "./components/Account/DeleteAccount"));
// const AsyncChangeEmail = lazy(() => import(/* webpackChunkName: "ChangeEmail" */ "./components/Account/ChangeEmail"));
// const AsyncConfirmEmail = lazy(() => import(/* webpackChunkName: "ConfirmEmail" */ "./components/Account/ConfirmEmail"));
// const AsyncConfirmRegistrationEmail = lazy(() => import(/* webpackChunkName: "ConfirmRegistrationEmail" */ "./components/Account/ConfirmRegistrationEmail"));
// const AsyncRegisterConfirmation = lazy(() => import(/* webpackChunkName: "RegisterConfirmation" */ "./components/Account/RegisterConfirmation"));

export const routes = (
    <div>
        <Routes>
            <App exact path="/" element={AsyncHome} layout={AsyncLayout} />
            <App path="/counter" element={AsyncCounter} layout={AsyncLayout} />
            <App
                path="/fetchdata/:startDateIndex?"
                element={AsyncFetchData}
                layout={AsyncLayout}
            />
            {/* <App path="/Signin" element={AsyncSignIn} layout={AsyncHomeLayout} /> 
             <App
                path="/Register"
                element={AsyncRegister}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ForgotPassword"
                element={AsyncForgotPassword}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ForgotPasswordConfirmation"
                element={AsyncForgotPasswordConfirmation}
                layout={AsyncHomeLayout}
            />
            <App
                path="/RegistrationConfirmation"
                element={AsyncRegisterConfirmation}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ConfirmRegistrationEmail/:userId?/:code?"
                element={AsyncConfirmRegistrationEmail}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ConfirmEmail/:userId?/:code?"
                element={AsyncConfirmEmail}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account/ResetPassword/:userId?/:code?"
                element={AsyncResetPassword}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ResetPasswordConfirmation"
                element={AsyncResetPasswordConfirmation}
                layout={AsyncHomeLayout}
            />
            <App
                path="/SignedOut"
                element={AsyncSignedOut}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Profile/Edit"
                element={RequiredAuthentication.requireAuthentication(
                    AsyncEditProfile
                )}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Profile"
                element={RequiredAuthentication.requireAuthentication(AsyncAccount)}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account/Delete"
                element={RequiredAuthentication.requireAuthentication(
                    AsyncDeleteAccount
                )}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account/ChangeEmail"
                element={RequiredAuthentication.requireAuthentication(
                    AsyncChangeEmail
                )}
                layout={AsyncHomeLayout}
            />
            <App
                path="/Account"
                element={RequiredAuthentication.requireAuthentication(AsyncAccount)}
                layout={AsyncHomeLayout}
            />
            <App
                path="/ChangePassword"
                element={RequiredAuthentication.requireAuthentication(
                    AsyncChangePassword
                )}
                layout={AsyncHomeLayout}
            /> */}
            <App element={AsyncNotFound} layout={AsyncHomeLayout} />
        </Routes>
    </div>
);
