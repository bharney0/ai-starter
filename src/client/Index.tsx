import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { loadableReady } from '@loadable/component'
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import * as RoutesModule from './routes';
import { AppState, rootReducers, useAppSelector } from './store/index';
import {actionCreators} from './store/Session';
import './styles/styles.scss';
import { configureStore } from '@reduxjs/toolkit';

let routes = RoutesModule.routes;
// Create browser history to use in the Redux store
const history = createBrowserHistory();

// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore({
    reducer: rootReducers,
});

store.dispatch(actionCreators.loadToken());

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing configuration
    // and injects the app into a DOM element.
    loadableReady(() => {
        ReactDOM.hydrate(
            <AppContainer>
                <Provider store={store}>
                    <ConnectedRouter history={history} children={routes} />
                </Provider>
            </AppContainer>,
            document.getElementById('react-app')
        );
    });
}

renderApp();

// Enable hot module replacement (HMR)
if (module.hot) {
    module.hot.accept('./routes', () => {
        const newRoutes = require<typeof RoutesModule>('./routes').routes;
        routes = newRoutes;
        renderApp();
    });
}
