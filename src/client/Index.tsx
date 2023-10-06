import { createBrowserHistory } from 'history';
import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { rootReducers } from './store';
import { Provider } from 'react-redux';

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore({
	reducer: rootReducers,
	middleware: [thunk]
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
				<App {...history} />
			</Provider>
		</BrowserRouter>
	);
}

renderApp();
