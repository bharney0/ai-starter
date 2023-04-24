import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../auth/authConfig';
import React from 'react';

const SignInButton = () => {
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
				redirectUri: '' //process.env.REACT_APP_POPUP_REDIRECT_URI, // e.g. /redirect
			});
		} else if (loginType === 'redirect') {
			instance.loginRedirect(loginRequest);
		}
	};

	return (
		<div className="form-group">
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
