import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faImage } from '@fortawesome/free-solid-svg-icons/faImage';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { lazy } from '@loadable/component';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { AlertType, ProfileViewModel } from '../../models';
import { ApplicationState } from '../../store/index';
import AlertState from '../../store/Alert';
import * as ProfileState from '../../store/Profile';
import * as SessionState from '../../store/Session';
import '../../styles/formStepper.scss';
import Loading from '../Common/Loading';
import LoadingRoute from '../Common/LoadingRoute';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const ProfileImageForm = lazy(
	() => import(/* webpackChunkName: "ProfileImageForm" */ './ProfileImageForm')
);
const ProfileNameForm = lazy(
	() => import(/* webpackChunkName: "ProfileNameForm" */ './ProfileNameForm')
);

type ProfileProps = ProfileState.ProfileState &
	SessionState.SessionState & {
		profileActions: typeof ProfileState.actionCreators;
		alertActions: typeof AlertState.actionCreators;
		sessionActions: typeof SessionState.actionCreators;
	};
// At runtime, Redux will merge together...

export const EditProfile = (props: ProfileProps) => {
	const steps = [
		{ name: 'Personal Info', icon: faUser },
		{ name: 'Upload Profile Image', icon: faImage }
	];

	const getNavStates = (indx: number, length: number) => {
		let styles = [];
		for (let i = 0; i < length; i++) {
			if (i < indx) {
				styles.push('done');
			} else if (i === indx) {
				styles.push('doing');
			} else {
				styles.push('todo');
			}
		}
		return { current: indx, styles: styles };
	};
	const history = useNavigate();
	const [state, setState] = useState({
		page: 1,
		showPreviousBtn: false,
		showNextBtn: true,
		compState: 0,
		navState: getNavStates(0, steps.length),
		isLoading: false
	});

	const nextPage = () => {
		setState({ ...state, page: state.page + 1 });
		setNavState(state.compState + 1);
		window.scrollTo(0, 0);
	};

	const previousPage = () => {
		setState({ ...state, page: state.page - 1 });
		if (state.compState > 0) {
			setNavState(state.compState - 1);
		}
		window.scrollTo(0, 0);
	};

	props.profileActions.getProfile();

	const checkNavState = (currentStep: number) => {
		if (currentStep > 0 && currentStep < steps.length - 1) {
			setState({
				...state,
				showPreviousBtn: true,
				showNextBtn: true
			});
		} else if (currentStep === 0) {
			setState({
				...state,
				showPreviousBtn: false,
				showNextBtn: true
			});
		} else {
			setState({
				...state,
				showPreviousBtn: true,
				showNextBtn: false
			});
		}
	};

	const setNavState = (next: number) => {
		setState({ ...state, navState: getNavStates(next, steps.length) });
		if (next < steps.length) {
			setState({ ...state, compState: next });
		}
		checkNavState(next);
	};

	const handleKeyDown = (evt: { which: number }) => {
		if (evt.which === 13) {
			nextPage();
		}
	};

	const moveToPage = (evt: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		if (
			evt.currentTarget.value <= state.compState ||
			evt.currentTarget.value == 1 ||
			evt.currentTarget.value == 0
		) {
			if (evt.currentTarget.value === steps.length - 1 && state.compState === steps.length - 1) {
				setNavState(steps.length - 1);
				setState({ ...state, page: steps.length });
			} else {
				setNavState(evt.currentTarget.value);
				setState({ ...state, page: evt.currentTarget.value + 1 });
			}
		}
		window.scrollTo(0, 0);
	};

	const getClassName = (className: string, i: number) => {
		return className + '-' + state.navState.styles[i];
	};

	const getIcon = (className: IconDefinition, i: number) => {
		if (i < state.compState) {
			return faCheck as IconProp;
		} else {
			return className as IconProp;
		}
	};

	const { profile } = props;
	const { page, isLoading } = state;
	return isLoading ? (
		<Loading />
	) : (
		<div className="container pt-4">
			<div className="row justify-content-center">
				<div key="checkoutheader" className="col-12 form-wrapper">
					<h2 className="text-center display-4">Profile.</h2>
				</div>
				<div className="col-12 col-sm-12 col-md-9 col-lg-7 form-wrapper pt-4">
					<div key="checkoutSteps" className="row multi-step" onKeyDown={handleKeyDown}>
						<div className="col-12">
							<ol className="progtrckr">
								{steps.map((s, i) => (
									<li
										className={getClassName('progtrckr', i)}
										onClick={e => moveToPage(e)}
										key={i}
										value={i}
									>
										<FontAwesomeIcon
											className="prog-icon svg-inline--fa fa-w-16 fa-lg"
											size="1x"
											icon={getIcon(steps[i].icon, i)}
										/>
										<span className="step-title">{steps[i].name}</span>
									</li>
								))}
							</ol>
						</div>
					</div>
					<div className="row justify-content-center pt-4">
						<div className="col-12 col-sm-10 col-md-8 col-lg-7 form-wrapper">
							{isLoading && (
								<FontAwesomeIcon
									className="svg-inline--fa fa-w-16 fa-lg"
									size="1x"
									style={{
										position: 'absolute',
										top: '10vh',
										left: '50%',
										fontSize: '45px'
									}}
									icon={faSpinner as IconProp}
									spin
								/>
							)}
							{page === 1 && (
								<ProfileNameForm
									initialValues={profile}
									onSubmit={(values: ProfileViewModel) => {
										nextPage();
									}}
								/>
							)}
							{page === 2 && (
								<ProfileImageForm
									initialValues={profile}
									onSubmit={(values: ProfileViewModel) => {
										window.scrollTo(0, 0);
										setState({ ...state, isLoading: true });
										props.profileActions.updateProfile(
											values,
											() => {
												props.alertActions.sendAlert({
													message: 'Your profile was saved successfully.',
													alertType: AlertType.success,
													autoClose: true
												});
												history('/Profile');
											},
											error => {
												props.alertActions.sendAlert({
													message: error.error_description,
													alertType: AlertType.danger,
													autoClose: true
												});
											}
										);
									}}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default connect(
	(state: ApplicationState) => state.profile,
	(dispatch: Dispatch) => {
		return {
			profileActions: bindActionCreators(ProfileState.actionCreators, dispatch),
			alertActions: bindActionCreators(AlertState.actionCreators, dispatch)
		};
	}
)(EditProfile);
