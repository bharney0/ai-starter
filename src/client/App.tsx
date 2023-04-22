import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ServerDataProvider } from './serverData';
import * as ReactDOM from 'react-dom';
import Footer from './components/Footer/Footer';
import NavMenu from './components/Nav/NavMenu';
import { lazy } from '@loadable/component';
import * as React from 'react';
import { Provider } from 'react-redux';
import { rootReducers } from './store/index';
import { actionCreators } from './store/Session';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { Suspense } from 'react';
// Get the application-wide store instance, prepopulating with state from the server where available.
const store = configureStore({
	reducer: rootReducers,
	middleware: [thunk]
});

const AsyncHome = lazy(() => import(/* webpackChunkName: "Home" */ './components/Home/Home'));
const AsyncCounter = lazy(
	() => import(/* webpackChunkName: "Counter" */ './components/Counter/Counter')
);
const AsyncFetchData = lazy(
	() => import(/* webpackChunkName: "FetchData" */ './components/WeatherForecast/FetchData')
);
const AsyncLayout = lazy(
	() => import(/* webpackChunkName: "Layout" */ './components/Layout/Layout')
);
const AsyncHomeLayout = lazy(
	() => import(/* webpackChunkName: "HomeLayout" */ './components/Layout/HomeLayout')
);
const AsyncNotFound = lazy(
	() => import(/* webpackChunkName: "NotFound" */ './components/NotFound/NotFound')
);
interface Props {
	/** Data used in the react prerender process. Use only in the server side. */
	serverData?: unknown;
}

type AppProps = Props & any;

interface On {
	on: boolean;
}
export const NavContext = React.createContext({
	on: false,
	toggle: () => {},
	onUpdate: () => {},
	handleOverlayToggle: (e: Event) => {}
});
export class App extends React.Component<AppProps, {}> {
	state = { on: false };

	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize = () => {
		if (window.innerWidth > 767) {
			this.setState(
				({ on }: On) => ({ on: false }),
				() => {
					this.handleSidebarToggle();
				}
			);
		}
	};

	toggle = () => {
		this.setState(
			({ on }: On) => ({ on: !on }),
			() => {
				if (this.state.on) {
					this.handleSidebarPosition();
				} else {
					this.handleSidebarToggle();
				}
			}
		);
	};
	onUpdate = () => {
		this.setState(
			({ on }: On) => ({ on: false }),
			() => {
				this.handleSidebarToggle();
				window.scrollTo(0, 0);
			}
		);
	};
	handleOverlayToggle = (e: Event) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains('overlay') || target.classList.contains('subMenu')) {
			this.setState(
				({ on }: On) => ({ on: false }),
				() => {
					this.handleSidebarToggle();
				}
			);
		}
	};
	private handleSidebarPosition() {
		let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar')) as HTMLElement;
		let bounding = sidebar.getBoundingClientRect();
		let offset = bounding.top + document.body.scrollTop;
		let totalOffset = (offset - 100) * -1;
		totalOffset = totalOffset < 0 ? 0 : totalOffset;
		(sidebar as HTMLElement).style.top = totalOffset + 'px';
		document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
	}

	private handleSidebarToggle() {
		let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar'));
		if (sidebar) {
			(sidebar as HTMLElement).removeAttribute('style');
		}
		document.getElementsByTagName('html')[0].style.overflowY = 'auto';
	}

	render() {
		const {
			component: Component,
			layout: Layout,
			session,
			sessionActions,
			alertActions,
			accountActions,
			serverData,
			...rest
		} = this.props;

		return (
			// <ServerDataProvider value={this.props ? serverData : null}>
			<Provider store={store}>
				<Routes>
					<Route
						path="/"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								<React.Fragment>
									<NavContext.Provider
										value={{
											on: this.state.on,
											toggle: this.toggle,
											onUpdate: this.onUpdate,
											handleOverlayToggle: this.handleOverlayToggle
										}}
									>
										<NavMenu
											accountActions={accountActions}
											alertActions={alertActions}
											sessionActions={sessionActions}
											{...session}
										/>
										<AsyncLayout {...rest} {...this.props}>
											<AsyncHome {...this.props} />
										</AsyncLayout>
										<Footer />
									</NavContext.Provider>
								</React.Fragment>
							</Suspense>
						}
					/>
					<Route
						path="/counter"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								<React.Fragment>
									<NavContext.Provider
										value={{
											on: this.state.on,
											toggle: this.toggle,
											onUpdate: this.onUpdate,
											handleOverlayToggle: this.handleOverlayToggle
										}}
									>
										<NavMenu
											accountActions={accountActions}
											alertActions={alertActions}
											sessionActions={sessionActions}
											{...session}
										/>
										<AsyncLayout {...rest} {...this.props}>
											<AsyncCounter {...this.props} />
										</AsyncLayout>
										<Footer />
									</NavContext.Provider>
								</React.Fragment>
							</Suspense>
						}
					/>
					<Route
						path="/fetchdata/:startDateIndex?"
						element={
							<Suspense fallback={<div>Loading...</div>}>
								<React.Fragment>
									<NavContext.Provider
										value={{
											on: this.state.on,
											toggle: this.toggle,
											onUpdate: this.onUpdate,
											handleOverlayToggle: this.handleOverlayToggle
										}}
									>
										<NavMenu
											accountActions={accountActions}
											alertActions={alertActions}
											sessionActions={sessionActions}
											{...session}
										/>
										<AsyncLayout {...rest} {...this.props}>
											<AsyncFetchData {...this.props} />
										</AsyncLayout>
										<Footer />
									</NavContext.Provider>
								</React.Fragment>
							</Suspense>
						}
					/>
				</Routes>
			</Provider>
			// </ServerDataProvider>
		);
	}
}

const Wrapper = styled.div`
	font-family: Arial, Helvetica, sans-serif;
	font-weight: bold;
	min-height: 100vh;
	display: grid;
	grid-template-areas:
		'header  header'
		'sidebar content';
	grid-template-columns: 200px 1fr;
	grid-template-rows: 50px 1fr;

	div.header {
		grid-area: header;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		padding: 8px;
		font-size: 22px;
		background-color: #087db3;
		color: white;
	}
	div.sidebar {
		grid-area: sidebar;
		display: flex;
		flex-flow: column nowrap;
		justify-content: right;
		gap: 36px;
		padding: 16px;
		background-color: #bedceb;

		a:visited {
			text-decoration: none;
		}
	}
	div.content {
		grid-area: content;
		padding: 8px;
	}
`;

export default App;
