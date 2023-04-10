import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { loadableReady } from "@loadable/component";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import * as RoutesModule from "./routes";
import { rootReducers } from "./store/index";
import { actionCreators } from "./store/Session";
import "./styles/styles.scss";
import { configureStore } from "@reduxjs/toolkit";

let routes = RoutesModule.routes;

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
          <BrowserRouter children={routes} />
        </Provider>
      </AppContainer>,
      document.getElementById("react-app")
    );
  });
}

renderApp();

// Enable hot module replacement (HMR)
if (module.hot) {
  module.hot.accept("./routes", () => {
    const newRoutes = require<typeof RoutesModule>("./routes").routes;
    routes = newRoutes;
    renderApp();
  });
}
