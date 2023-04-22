import { createBrowserHistory } from 'history';
import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { loadableReady } from '@loadable/component';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import * as RoutesModule from './routes';
import { rootReducers } from './store/index';
import { actionCreators } from './store/Session';
import { configureStore } from '@reduxjs/toolkit';
import App from './App';

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
			<App {...history} />
		</BrowserRouter>
	);
}

renderApp();
