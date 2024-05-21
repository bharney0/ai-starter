import { LogLevel } from '@azure/msal-browser';
// Browser check variables
// If you support IE, our recommendation is that you sign-in using Redirect APIs
// If you as a developer are testing using Edge InPrivate mode, please add "isEdge" to the if check
const ua = window.navigator.userAgent;
const msie = ua.indexOf('MSIE ');
const msie11 = ua.indexOf('Trident/');
const msedge = ua.indexOf('Edge/');
const firefox = ua.indexOf('Firefox');
const isIE = msie > 0 || msie11 > 0;
const isEdge = msedge > 0;
const isFirefox = firefox > 0; // Only needed if you need to support the redirect flow in Firefox incognito

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
// Config object to be passed to Msal on creation
export const msalConfig = {
	auth: {
		clientId: process.env.REACT_APP_CLIENT_ID,
		authority: 'https://login.microsoftonline.com/consumers/', //process.env.REACT_APP_AUTHORITY,
		redirectUri: '/',
		postLogoutRedirectUri: '/'
	},
	cache: {
		cacheLocation: 'localStorage',
		storeAuthStateInCookie: isIE || isEdge || isFirefox
	},
	system: {
		allowNativeBroker: false, // Disables WAM Broker
		loggerOptions: {
			loggerCallback: (level: any, message: any, containsPii: any) => {
				if (containsPii) {
					return;
				}
				switch (level) {
					case LogLevel.Error:
						console.error(message);
						return;
					case LogLevel.Info:
						console.info(message);
						return;
					case LogLevel.Verbose:
						console.debug(message);
						return;
					case LogLevel.Warning:
						console.warn(message);
						return;
					default:
						return;
				}
			}
		}
	}
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
	scopes: ['User.Read']
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
	graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
};

// Refactored from https://github.com/Azure-Samples/ms-identity-javascript-react-tutorial/blob/main/1-Authentication/1-sign-in/SPA/src/authConfig.js

import { IPublicClientApplication } from "@azure/msal-browser";

const appServicesAuthTokenUrl = ".auth/me";
const appServicesAuthTokenRefreshUrl = ".auth/refresh";
const appServicesAuthLogoutUrl = ".auth/logout?post_logout_redirect_uri=/";

interface AppServicesToken {
    id_token: string;
    access_token: string;
    user_claims: Record<string, any>;
}

interface AuthSetup {
    // Set to true if login elements should be shown in the UI
    useLogin: boolean;
    // Set to true if access control is enforced by the application
    requireAccessControl: boolean;
    // Set to true if the application allows unauthenticated access (only applies for documents without access control)
    enableUnauthenticatedAccess: boolean;
    /**
     * Configuration object to be passed to MSAL instance on creation.
     * For a full list of MSAL.js configuration parameters, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
     */
    msalConfig: {
        auth: {
            clientId: string; // Client app id used for login
            authority: string; // Directory to use for login https://learn.microsoft.com/azure/active-directory/develop/msal-client-application-configuration#authority
            redirectUri: string; // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
            postLogoutRedirectUri: string; // Indicates the page to navigate after logout.
            navigateToLoginRequestUrl: boolean; // If "true", will navigate back to the original request location before processing the auth code response.
        };
        cache: {
            cacheLocation: string; // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
            storeAuthStateInCookie: boolean; // Set this to "true" if you are having issues on IE11 or Edge
        };
    };
    loginRequest: {
        /**
         * Scopes you add here will be prompted for user consent during sign-in.
         * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
         * For more information about OIDC scopes, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
         */
        scopes: Array<string>;
    };
    tokenRequest: {
        scopes: Array<string>;
    };
}

export const useLogin = true;

export const requireAccessControl = true;

export const enableUnauthenticatedAccess = true;

export const requireLogin = requireAccessControl && !enableUnauthenticatedAccess;

const tokenRequest = { ...msalConfig.auth, ...loginRequest };

// Build an absolute redirect URI using the current window's location and the relative redirect URI from auth setup
export const getRedirectUri = () => {
    return window.location.origin + msalConfig.auth.redirectUri;
};

// Get an access token if a user logged in using app services authentication
// Returns null if the app doesn't support app services authentication
const getAppServicesToken = (): Promise<AppServicesToken | null> => {
    return fetch(appServicesAuthTokenRefreshUrl).then(r => {
        if (r.ok) {
            return fetch(appServicesAuthTokenUrl).then(r => {
                if (r.ok) {
                    return r.json().then(json => {
                        if (json.length > 0) {
                            return {
                                id_token: json[0]["id_token"] as string,
                                access_token: json[0]["access_token"] as string,
                                user_claims: json[0]["user_claims"].reduce((acc: Record<string, any>, item: Record<string, any>) => {
                                    acc[item.typ] = item.val;
                                    return acc;
                                }, {}) as Record<string, any>
                            };
                        }

                        return null;
                    });
                }

                return null;
            });
        }

        return null;
    });
};


// Sign out of app services
// Learn more at https://learn.microsoft.com/azure/app-service/configure-authentication-customize-sign-in-out#sign-out-of-a-session
export const appServicesLogout = () => {
    window.location.href = appServicesAuthLogoutUrl;
};

// Determine if the user is logged in
// The user may have logged in either using the app services login or the on-page login
export const isLoggedIn = (client: IPublicClientApplication | undefined): boolean => {
    return client?.getActiveAccount() != null;
};

// Get an access token for use with the API server.
// ID token received when logging in may not be used for this purpose because it has the incorrect audience
// Use the access token from app services login if available
export const getToken = (client: IPublicClientApplication): Promise<string | undefined> => {
    return client
        .acquireTokenSilent({
            ...tokenRequest,
            redirectUri: getRedirectUri()
        })
        .then(r => r.accessToken)
        .catch(error => {
            console.log(error);
            return undefined;
        });
};
