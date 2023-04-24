import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { NavContext } from '../../App';
import { ApplicationState } from '../../store/index';
import * as SessionState from '../../store/Session';
import AdminNavMenu from './AdminNavMenu';
import { useMsal } from '@azure/msal-react';
interface NavProps {
	onUpdate: () => void;
}
type MemberNavMenuProps = SessionState.SessionState & {
	sessionActions: typeof SessionState.actionCreators;
};

export const MemberNavMenu = (props: MemberNavMenuProps) => {
	const { instance, accounts } = useMsal();
	if (accounts.length > 0) {
		const { username } = accounts[0];

		if (username == '') return null;

		return (
			<React.Fragment>
				<NavContext.Consumer {...props}>
					{({ onUpdate }: NavProps) => (
						<li className="nav-item">
							<NavLink
								key="nav-account"
								className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link root')}
								to={'/Account'}
								onClick={onUpdate}
							>
								Account
							</NavLink>
						</li>
					)}
				</NavContext.Consumer>
			</React.Fragment>
		);
	}

	return null;
};

export default connect(
	(state: ApplicationState) => {
		return state.session;
	}, // Selects which state properties are merged into the component's props
	(dispatch: Dispatch) => {
		// Selects which action creators are merged into the component's props
		return {
			sessionActions: bindActionCreators(SessionState.actionCreators, dispatch)
		};
	}
)(MemberNavMenu);
