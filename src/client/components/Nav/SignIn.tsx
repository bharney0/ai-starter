import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { NavContext } from '../../App';
import { useMsal } from '@azure/msal-react';

interface NavProps {
	onUpdate: () => void;
}

type UserMenuProps = any;
export const SignIn = (_props: UserMenuProps) => {
	const { accounts } = useMsal();
	if (accounts?.length > 0) {
		return null;
	}
	return (
		<li className="nav-item">
			<NavContext.Consumer>
				{({ onUpdate }: NavProps) => (
					<Link className="nav-link userMenu user-icon" to="/signin" onClick={onUpdate}>
						<FontAwesomeIcon size="1x" icon={faSignInAlt} /> Sign In
					</Link>
				)}
			</NavContext.Consumer>
		</li>
	);
};
export default SignIn;
