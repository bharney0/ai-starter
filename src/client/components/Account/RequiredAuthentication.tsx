import * as React from 'react';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { AlertType } from '../../models';
import { ApplicationState, useAppSelector } from '../../store/index';
import * as AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import * as AccountState from '../../store/Account';
import { useMsal } from '@azure/msal-react';
import { useActionData, useNavigate } from 'react-router';
import { actionCreators as sessionActions } from '../../store/Session';
import { actionCreators as accountActions } from '../../store/Account';
import { actionCreators as alertActions } from '../../store/Alert';

type SessionProps = SessionState.SessionState & {
	sessionActions: typeof SessionState.actionCreators;
	alertActions: typeof AlertState.actionCreators;
	accountActions: typeof AccountState.actionCreators;
};
export const RequireAuthentication = ({ children }: { children: any }) => {
	const { instance, accounts } = useMsal();
	const { session } = useAppSelector(state => state);
	const history = useNavigate();

	const checkAuth = (props: SessionProps & any) => {
		if (session.isRequiredRefreshOnClient === true) return;

		// check if we dont have any accounts
		if (accounts === undefined || accounts?.length <= 0) {
			alertActions.sendAlert(
				'You must sign-in before you can access this area.',
				AlertType.danger,
				true
			);
			sessionActions.requiredToken();
			history(`/signin`);
			sessionActions.loadToken();
		}
	};
	checkAuth(session);

	return children;
};
export default connect(
	(state: ApplicationState) => state.session, // Selects which state properties are merged into the component's props
	(dispatch: Dispatch) => {
		return {
			sessionActions: bindActionCreators(SessionState.actionCreators, dispatch),
			alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
			accountActions: bindActionCreators(AccountState.actionCreators, dispatch)
		};
	} // Selects which action creators are merged into the component's props
)(RequireAuthentication);
