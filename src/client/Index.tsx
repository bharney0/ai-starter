import { createBrowserHistory } from 'history';
import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore({
	reducer: rootReducers,
	middleware: [thunk]
});

// MSAL imports
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './auth/authConfig';
import { rootReducers } from './store';
import { Provider } from 'react-redux';
import { actionCreators } from './store/Account';

export const msalInstance = new PublicClientApplication(msalConfig);

// Default to using the first account if no account is active on page load
if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
	// Account selection logic is app dependent. Adjust as needed for different use cases.
	msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
}

// Optional - This will update account state if a user signs in from another tab or window
msalInstance.enableAccountStorageEvents();

msalInstance.addEventCallback(event => {
	if (
		event.eventType === EventType.LOGIN_SUCCESS &&
		event.payload &&
		(event.payload as any).account
	) {
		const account = (event.payload as any).account;
		msalInstance.setActiveAccount(account);
	}
});

function renderApp() {
	const root = document.getElementById('root');
	if (!root) {
		throw new Error('Root element not found');
	}
	// This code starts up the React app when it runs in a browser. It sets up the routing configuration
	// and injects the app into a DOM element.
	const history = createBrowserHistory();
	const app = createRoot(root);
	app.render(
		<BrowserRouter>
			<Provider store={store}>
				<App {...history} pca={msalInstance} />
			</Provider>
		</BrowserRouter>
	);
}

renderApp();
