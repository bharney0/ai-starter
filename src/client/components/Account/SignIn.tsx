import * as React from 'react';
import { connect } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import { InjectedFormProps } from 'redux-form';
import { AlertType, Field as ModelField, LoginViewModel } from '../../models';
import { ApplicationState } from '../../store/index';
import * as AccountState from '../../store/Account';
import * as AlertState from '../../store/Alert';
import * as SessionState from '../../store/Session';
import LoadingRoute from '../Common/LoadingRoute';
import { lazy } from '@loadable/component';

const AsyncSigninForm = lazy(() => import(/* webpackChunkName: "SignInForm" */ './SignInForm'));
const AsyncSignInButton = lazy(() => import(/* webpackChunkName: "SignInForm" */ './SignInButton'));

type UserMenuProps = AccountState.AccountState & {
	accountActions: typeof AccountState.actionCreators;
	alertActions: typeof AlertState.actionCreators;
	sessionActions: typeof SessionState.actionCreators;
};

interface AdditionalProps {
	onCancel: () => void;
	fields: ModelField[];
	formButton?: string;
}

type FormProps = InjectedFormProps & AdditionalProps & UserMenuProps & any;

const SignIn = (props: FormProps) => {
	const history = useNavigate();
	return (
		<div className="container pt-4">
			<div className="row justify-content-center pt-4">
				<div className="col-12 col-sm-8 col-md-6 col-lg-5">
					<h2 className="text-center display-4">Sign-In.</h2>
					<AsyncSignInButton />
				</div>
			</div>
		</div>
	);
};

export default connect(
	(state: ApplicationState) => state.account, // Selects which state properties are merged into the component's props
	(dispatch: Dispatch) => {
		// Selects which action creators are merged into the component's props
		return {
			accountActions: bindActionCreators(AccountState.actionCreators, dispatch),
			alertActions: bindActionCreators(AlertState.actionCreators, dispatch),
			sessionActions: bindActionCreators(SessionState.actionCreators, dispatch)
		};
	}
)(SignIn);
