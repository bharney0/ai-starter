import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { NavLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { NavContext } from '../../App';
import { ApplicationState } from '../../store/index';
import * as SessionState from '../../store/Session';
import AdminNavMenu from './AdminNavMenu';
interface NavProps {
	onUpdate: () => void;
}
type MemberNavMenuProps = SessionState.SessionState & {
	sessionActions: typeof SessionState.actionCreators;
};

export class MemberNavMenu extends React.Component<MemberNavMenuProps, {}> {
	public render() {
		const { username, token } = this.props;

		if (username == '') return null;

		if (token == undefined) return null;

		if (Object.keys(token).length === 0) return null;

		if (username == undefined) return null;

		if (username.indexOf('@guest.starterpack.com') === -1) {
			return (
				<React.Fragment>
					<NavContext.Consumer {...this.props}>
						{({ onUpdate }: NavProps) => (
							<li className="nav-item">
								<NavLink
									key="nav-account"
									className={({ isActive }) => (isActive ? '"nav-link" active' : '"nav-link" root')}
									to={'/Account'}
									onClick={onUpdate}
								>
									Account
								</NavLink>
							</li>
						)}
					</NavContext.Consumer>
					<AdminNavMenu {...this.props} />
				</React.Fragment>
			);
		}

		return null;
	}
}

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
