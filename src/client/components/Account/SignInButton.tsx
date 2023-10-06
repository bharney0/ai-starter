import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../auth/authConfig';
import React from 'react';
import * as AccountState from '../../store/Account';
import AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import { AlertType } from '../../models';

type MemberUserMenuProps = SessionState.SessionState & {
	sessionActions: typeof SessionState.actionCreators;
	alertActions: typeof AlertState.actionCreators;
	accountActions: typeof AccountState.actionCreators;
};

type AdminUserMenuProps = SessionState.SessionState & {
	sessionActions: typeof SessionState.actionCreators;
};

const SignInButton = (props: MemberUserMenuProps) => {
	const { instance } = useMsal();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleLogin = (loginType: string) => {
		setAnchorEl(null);

		if (loginType === 'popup') {
			/**
			 * When using popup and silent APIs, we recommend setting the redirectUri to a blank page or a page
			 * that does not implement MSAL. Keep in mind that all redirect routes must be registered with the application
			 * For more information, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/login-user.md#redirecturi-considerations
			 */
			instance.loginPopup({
				...loginRequest,
				redirectUri: '/' //process.env.REACT_APP_POPUP_REDIRECT_URI, // e.g. /redirect
			});
		} else if (loginType === 'redirect') {
			instance.loginRedirect({
				...loginRequest,
				redirectUri: '/',
				onRedirectNavigate: (url: string = '/') => {
					props.alertActions.sendAlert({
						message: 'Signed out successfully!',
						alertType: AlertType.success,
						autoClose: true
					});
				}
			});
		}
	};

	return (
		<div className="mt-5 d-flex justify-content-center">
			<button
				className="btn btn-lg btn-primary btn-block"
				type="submit"
				onClick={() => handleLogin('redirect')}
			>
				Sign-In
			</button>
		</div>
	);
};

export default SignInButton;
