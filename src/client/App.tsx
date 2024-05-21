import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ServerDataProvider } from './serverData';
import * as ReactDOM from 'react-dom';
import Footer from './components/Footer/Footer';
import NavMenu from './components/Nav/NavMenu';
import { lazy } from '@loadable/component';
import * as React from 'react';
import { Provider, ReactReduxContext, useStore } from 'react-redux';
import { rootReducers, useAppSelector } from './store/index';
import { actionCreators as sessionActions } from './store/Session';
import { actionCreators as accountActions } from './store/Account';
import { actionCreators as alertActions } from './store/Alert';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss';
import { Suspense, useContext, useState } from 'react';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { CustomNavigationClient } from './components/Account/NavigationClient';
import Loading from './components/Common/Loading';
import RequiredAuthentication, {
	RequireAuthentication
} from './components/Account/RequiredAuthentication';
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
const AsyncNotFound = lazy(
	() => import(/* webpackChunkName: "NotFound" */ './components/NotFound/NotFound')
);
const AsyncSignIn = lazy(
	() => import(/* webpackChunkName: "SignIn" */ './components/Account/SignIn')
);
const AsyncHomeLayout = lazy(
	() => import(/* webpackChunkName: "HomeLayout" */ './components/Layout/HomeLayout')
);
const AsyncEditProfile = lazy(
	() => import(/* webpackChunkName: "EditProfile" */ './components/Profile/EditProfile')
);
const AsyncUserChatMessage = lazy(
	() => import(/* webpackChunkName: "Chat" */ './pages/chat/Chat')
);
const AsyncProfile = lazy(
	() => import(/* webpackChunkName: "Profile" */ './components/Profile/Profile')
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

export const AuthContext = React.createContext(null);
export const App = (props: AppProps) => {
	const [state, setState] = useState({ on: false });
	const session = useAppSelector(state => state);

	const toggle = () => {
		setState({ on: !state.on });
		if (state.on) {
			handleSidebarPosition();
		} else {
			handleSidebarToggle();
		}
	};
	const onUpdate = () => {
		setState({ on: false });
		handleSidebarToggle();
		window.scrollTo(0, 0);
	};
	const handleSidebarPosition = () => {
		let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar')) as HTMLElement;
		let bounding = sidebar.getBoundingClientRect();
		let offset = bounding.top + document.body.scrollTop;
		let totalOffset = (offset - 100) * -1;
		totalOffset = totalOffset < 0 ? 0 : totalOffset;
		(sidebar as HTMLElement).style.top = totalOffset + 'px';
		document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
	};
	const handleSidebarToggle = () => {
		let sidebar = ReactDOM.findDOMNode(document.getElementById('sidebar'));
		if (sidebar) {
			(sidebar as HTMLElement).removeAttribute('style');
		}
		document.getElementsByTagName('html')[0].style.overflowY = 'auto';
	};
	const handleOverlayToggle = (e: Event) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains('overlay') || target.classList.contains('subMenu')) {
			setState({ on: false });
			handleSidebarToggle();
		}
	};
	const handleResize = () => {
		if (window.innerWidth > 767) {
			setState({ on: false }), handleSidebarToggle();
		}
	};

	window.addEventListener('resize', handleResize);
	const { pca, ...rest } = props;
	return (
		// <ServerDataProvider value={props ? serverData : null}>
		<MsalProvider instance={pca}>
			<Routes>
				<Route
					path="/"
					element={
						<Suspense fallback={<Loading />}>
							<React.Fragment>
								<NavContext.Provider
									value={{
										on: state.on,
										toggle: toggle,
										onUpdate: onUpdate,
										handleOverlayToggle: handleOverlayToggle
									}}
								>
									<NavMenu
										accountActions={accountActions}
										alertActions={alertActions}
										sessionActions={sessionActions}
										{...session}
										{...(props as any)}
									/>
									<AsyncLayout {...rest} {...props}>
										<AsyncHome {...props} />
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
						<Suspense fallback={<Loading />}>
							<React.Fragment>
								<NavContext.Provider
									value={{
										on: state.on,
										toggle: toggle,
										onUpdate: onUpdate,
										handleOverlayToggle: handleOverlayToggle
									}}
								>
									<NavMenu
										accountActions={accountActions}
										alertActions={alertActions}
										sessionActions={sessionActions}
										{...session}
										{...(props as any)}
									/>
									<AsyncLayout {...rest} {...props}>
										<AsyncCounter {...props} />
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
						<Suspense fallback={<Loading />}>
							<React.Fragment>
								<NavContext.Provider
									value={{
										on: state.on,
										toggle: toggle,
										onUpdate: onUpdate,
										handleOverlayToggle: handleOverlayToggle
									}}
								>
									<NavMenu
										accountActions={accountActions}
										alertActions={alertActions}
										sessionActions={sessionActions}
										{...session}
										{...(props as any)}
									/>
									<AsyncLayout {...rest} {...props}>
										<AsyncFetchData {...props} />
									</AsyncLayout>
									<Footer />
								</NavContext.Provider>
							</React.Fragment>
						</Suspense>
					}
				/>
				<Route
					path="/signin"
					element={
						<Suspense fallback={<Loading />}>
							<React.Fragment>
								<NavContext.Provider
									value={{
										on: state.on,
										toggle: toggle,
										onUpdate: onUpdate,
										handleOverlayToggle: handleOverlayToggle
									}}
								>
									<NavMenu
										accountActions={accountActions}
										alertActions={alertActions}
										sessionActions={sessionActions}
										{...session}
										{...(props as any)}
									/>
									<AsyncHomeLayout {...rest} {...props}>
										<AsyncSignIn {...props} />
									</AsyncHomeLayout>
									<Footer />
								</NavContext.Provider>
							</React.Fragment>
						</Suspense>
					}
				/>
				<Route
					path="/account"
					element={
						<Suspense fallback={<Loading />}>
							<React.Fragment>
								<RequireAuthentication
									alertActions={alertActions}
									sessionActions={sessionActions}
									accountActions={accountActions}
									{...session}
									{...rest}
								>
									<NavContext.Provider
										value={{
											on: state.on,
											toggle: toggle,
											onUpdate: onUpdate,
											handleOverlayToggle: handleOverlayToggle
										}}
									>
										<NavMenu
											accountActions={accountActions}
											alertActions={alertActions}
											sessionActions={sessionActions}
											{...session}
											{...(props as any)}
										/>
										<AsyncHomeLayout {...rest} {...props}>
											<AsyncProfile {...(props as any)} />
										</AsyncHomeLayout>
										<Footer />
									</NavContext.Provider>
								</RequireAuthentication>
							</React.Fragment>
						</Suspense>
					}
				/>
				<Route
					path="/account/edit"
					element={
						<Suspense fallback={<Loading />}>
							<React.Fragment>
								<RequireAuthentication
									alertActions={alertActions}
									sessionActions={sessionActions}
									accountActions={accountActions}
									{...session}
									{...rest}
								>
									<NavContext.Provider
										value={{
											on: state.on,
											toggle: toggle,
											onUpdate: onUpdate,
											handleOverlayToggle: handleOverlayToggle
										}}
									>
										<NavMenu
											accountActions={accountActions}
											alertActions={alertActions}
											sessionActions={sessionActions}
											{...session}
											{...(props as any)}
										/>
										<AsyncHomeLayout {...rest} {...props}>
											<AsyncEditProfile {...(props as any)} />
										</AsyncHomeLayout>
										<Footer />
									</NavContext.Provider>
								</RequireAuthentication>
							</React.Fragment>
						</Suspense>
					}
				/>
				<Route
					path="/chat"
					element={
						<Suspense fallback={<Loading />}>
							<React.Fragment>
								<RequireAuthentication
									alertActions={alertActions}
									sessionActions={sessionActions}
									accountActions={accountActions}
									{...session}
									{...rest}
								>
									<NavContext.Provider
										value={{
											on: state.on,
											toggle: toggle,
											onUpdate: onUpdate,
											handleOverlayToggle: handleOverlayToggle
										}}
									>
										<NavMenu
											accountActions={accountActions}
											alertActions={alertActions}
											sessionActions={sessionActions}
											{...session}
											{...(props as any)}
										/>
										<AsyncHomeLayout {...rest} {...props}>
											<AsyncUserChatMessage {...(props as any)} />
										</AsyncHomeLayout>
										<Footer />
									</NavContext.Provider>
								</RequireAuthentication>
							</React.Fragment>
						</Suspense>
					}
				/>
				<Route
					path="/*"
					element={
						<Suspense fallback={<Loading />}>
							<React.Fragment>
								<NavContext.Provider
									value={{
										on: state.on,
										toggle: toggle,
										onUpdate: onUpdate,
										handleOverlayToggle: handleOverlayToggle
									}}
								>
									<NavMenu
										accountActions={accountActions}
										alertActions={alertActions}
										sessionActions={sessionActions}
										{...session}
										{...(props as any)}
									/>
									<AsyncLayout {...rest} {...props}>
										<AsyncNotFound {...props} />
									</AsyncLayout>
									<Footer />
								</NavContext.Provider>
							</React.Fragment>
						</Suspense>
					}
				/>
			</Routes>
		</MsalProvider>
	);
};

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
