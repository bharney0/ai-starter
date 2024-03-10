import { Action, Reducer } from 'redux';
import {
	AlertType,
	Bearer,
	ChangeEmailViewModel,
	ChangePasswordViewModel,
	ConfirmEmailViewModel,
	ConfirmRegistrationViewModel,
	DeleteAccountViewModel,
	ErrorMessage,
	ForgotPasswordViewModel,
	LoginViewModel,
	RegisterViewModel,
	ResetPasswordViewModel
} from '../models';
import { decodeToken, removeToken, saveToken, unloadedTokenState } from '../utils/TokenUtility';
import { AppThunkAction } from './';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface AccountState {
	username?: string;
	token?: Bearer;
	isRequiredToken: boolean;
	isRequiredRefreshOnClient?: boolean;
	isLoading: boolean;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
interface RequestTokenAction {
	type: 'REQUEST_TOKEN';
	username: string;
}

interface ReceiveTokenAction {
	type: 'RECEIVE_TOKEN';
	username?: string;
	token?: Bearer;
}

interface LogoutAction {
	type: 'LOGOUT';
}

interface RequestVerificationAction {
	type: 'REQUEST_VERIFICATION';
	username: string;
}

interface ReceiveVerificationAction {
	type: 'RECEIVE_VERIFICATION';
	username?: ForgotPasswordViewModel;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction =
	| RequestTokenAction
	| ReceiveTokenAction
	| RequestVerificationAction
	| ReceiveVerificationAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
	login:
		(
			value: LoginViewModel,
			callback?: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async dispatch => {
			if (!value.rememberMe) {
				value.rememberMe = false;
			}
			await fetch('/Account/Login', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, text/plain, */*'
				},
				credentials: 'include',
				body: JSON.stringify(value)
			})
				.then(response => response.json() as Promise<Bearer | ErrorMessage>)
				.then(data => {
					if ((data as ErrorMessage).error) {
						if (error) {
							error(data as ErrorMessage);
						}
					} else {
						let BearerToken: Bearer | undefined = decodeToken(data);
						dispatch({
							type: 'RECEIVE_TOKEN',
							username: BearerToken?.name ?? '',
							token: BearerToken
						});
						if (BearerToken) saveToken(BearerToken);
						if (callback) {
							callback();
						}
					}
				})
				.catch(err => {
					const token = unloadedTokenState();
					dispatch({
						type: 'RECEIVE_TOKEN',
						token: token,
						username: token.name || ''
					});
				});
			dispatch({ type: 'REQUEST_TOKEN', username: value.email ?? '' });
		},
	logout:
		(callback?: () => void): AppThunkAction<LogoutAction> =>
		async (dispatch, _getState) => {
			dispatch({ type: 'LOGOUT' });
			if (callback) {
				callback();
			}
		},
	register:
		(
			value: RegisterViewModel,
			callback?: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async dispatch => {
			if (value.password !== value.confirmPassword) {
				let errorMessage: ErrorMessage = {
					error_description: 'Password and Confirmation Password do not match.'
				};
				if (error) error(errorMessage);
			} else {
				await fetch('/Account/Register', {
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json, text/plain, */*'
					},
					credentials: 'include',
					body: JSON.stringify(value)
				})
					.then(response => response.json() as Promise<{} | ErrorMessage>)
					.then(data => {
						if ((data as ErrorMessage).error) {
							if (error) {
								error(data as ErrorMessage);
							}
						} else {
							if (callback) {
								callback();
							}
						}
					})
					.catch(() => {
						const token = unloadedTokenState();
						dispatch({
							type: 'RECEIVE_TOKEN',
							token: token,
							username: token.name || ''
						});
					});
				dispatch({ type: 'REQUEST_TOKEN', username: value.email ?? '' });
			}
		},
	forgotPassword:
		(username: string): AppThunkAction<KnownAction> =>
		async dispatch => {
			const model = {
				Email: username
			};
			await fetch('/Account/ForgotPassword', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, text/plain, */*'
				},
				body: JSON.stringify(model)
			})
				.then(response => response.json() as Promise<ForgotPasswordViewModel | ErrorMessage>)
				.then(data => {
					if ((data as ErrorMessage).error) {
						dispatch({ type: 'RECEIVE_VERIFICATION', username: undefined });
					} else {
						dispatch({
							type: 'RECEIVE_VERIFICATION',
							username: username as ForgotPasswordViewModel
						});
					}
				})
				.catch(() => {
					dispatch({ type: 'REQUEST_VERIFICATION', username: undefined ?? '' });
				});
			dispatch({ type: 'REQUEST_VERIFICATION', username: username });
		},
	changePassword:
		(
			value: ChangePasswordViewModel,
			callback?: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async dispatch => {
			if (value.newPassword === value.confirmPassword) {
				await fetch('/Account/ChangePassword', {
					method: 'post',
					headers: {
						Authorization: `Bearer ${token.access_token}`,
						'Content-Type': 'application/json',
						Accept: 'application/json, text/plain, */*'
					},
					credentials: 'include',
					body: JSON.stringify(value)
				})
					.then(response => response.json() as Promise<Bearer | ErrorMessage>)
					.then(data => {
						if ((data as ErrorMessage).error) {
							dispatch({ type: 'RECEIVE_TOKEN', token: undefined, username: '' });
						} else {
							let BearerToken: Bearer | undefined = decodeToken(data);
							dispatch({
								type: 'RECEIVE_TOKEN',
								username: BearerToken?.name ?? '',
								token: BearerToken
							});
							if (BearerToken) saveToken(BearerToken);
							if (callback) {
								callback();
							}
						}
					})
					.catch(err => {
						let errorMessage: ErrorMessage = {
							error_description:
								'Failed to change password. Please make sure your old password is correct.'
						};
						if (error) error(errorMessage);
						const token = unloadedTokenState();
						dispatch({
							type: 'RECEIVE_TOKEN',
							token: token,
							username: token.name || ''
						});
					});
				dispatch({ type: 'REQUEST_TOKEN', username: username });
			} else {
				let errorMessage: ErrorMessage = {
					error_description:
						'Your new password and confirmation password do not match. Please make sure they match.'
				};
				if (error) error(errorMessage);
			}
		},
	resetPassword:
		(
			value: ResetPasswordViewModel,
			callback?: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async dispatch => {
			if (
				value.email &&
				value.password &&
				value.confirmPassword &&
				value.password === value.confirmPassword
			) {
				await fetch('/Account/ResetPassword', {
					method: 'post',
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json, text/plain, */*'
					},
					credentials: 'include',
					body: JSON.stringify(value)
				})
					.then(response => response.json() as Promise<Bearer | ErrorMessage>)
					.then(data => {
						if ((data as ErrorMessage).error) {
							dispatch({ type: 'RECEIVE_TOKEN', token: undefined, username: '' });
						} else {
							let BearerToken: Bearer | undefined = decodeToken(data);
							dispatch({
								type: 'RECEIVE_TOKEN',
								username: BearerToken?.name ?? '',
								token: BearerToken
							});
							if (BearerToken) saveToken(BearerToken);
							if (callback) {
								callback();
							}
						}
					})
					.catch(() => {
						let errorMessage: ErrorMessage = {
							error_description: 'Failed to reset password.'
						};
						if (error) error(errorMessage);
						const token = unloadedTokenState();
						dispatch({
							type: 'RECEIVE_TOKEN',
							token: token,
							username: token.name || ''
						});
					});
				dispatch({ type: 'REQUEST_TOKEN', username: username });
			} else {
				let errorMessage: ErrorMessage = {
					error_description: 'You cannot have any empty fields, and the password fields must match.'
				};
				if (error) error(errorMessage);
			}
		},
	deleteAccount:
		(
			value: DeleteAccountViewModel,
			callback?: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async (dispatch, getState) => {
			let token = getState().session.token;
			let fetchTask: Promise<any>;
			if (token) {
				if (!value.userName && value.userName != token.name) {
					let errorMessage: ErrorMessage = {
						error_description:
							'Failed to delete account. Please make sure you typed your email correctly.'
					};
					if (error) error(errorMessage);
				} else {
					await fetch('/Account/Delete', {
						method: 'post',
						headers: {
							Authorization: `Bearer ${token.access_token}`,
							'Content-Type': 'application/json',
							Accept: 'application/json, text/plain, */*'
						},
						credentials: 'include',
						body: JSON.stringify(value)
					})
						.then(response => response.json() as Promise<Bearer | ErrorMessage>)
						.then(data => {
							if ((data as ErrorMessage).error) {
								if (error) {
									error(data as ErrorMessage);
								}
							} else {
								removeToken();
								let BearerToken: Bearer | undefined = decodeToken(data);
								dispatch({
									type: 'RECEIVE_TOKEN',
									username: BearerToken?.name ?? '',
									token: BearerToken
								});
								if (BearerToken) saveToken(BearerToken);
								if (callback) {
									callback();
								}
							}
						})
						.catch(err => {
							const token = unloadedTokenState();
							dispatch({
								type: 'RECEIVE_TOKEN',
								token: token,
								username: token.name || ''
							});
						});
					dispatch({ type: 'REQUEST_TOKEN', username: value.userName ?? '' });
				}
			}
		},
	downloadAccountData: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
		let token = getState().session.token;
		if (token) {
			await fetch('/Account/Download', {
				method: 'get',
				headers: {
					Authorization: `Bearer ${token.access_token}`,
					'Content-Disposition': "attachment; filename='data.json' filename*='data.json'"
				},
				credentials: 'include'
			})
				.then(response => response.blob())
				// .then(blob => saveAs(blob, "data.json"))
				.catch(err => {
					console.log(err);
				});
		}
	},
	changeEmail:
		(
			value: ChangeEmailViewModel,
			callback?: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async (dispatch, getState) => {
			let token = getState().session.token;
			if (token) {
				if (!value.unConfirmedEmail && value.confirmedEmail != token.name) {
					let errorMessage: ErrorMessage = {
						error_description:
							'Failed to delete account. Please make sure you typed your email correctly.'
					};
					if (error) error(errorMessage);
				} else {
					await fetch('/Account/ChangeEmail', {
						method: 'post',
						headers: {
							Authorization: `Bearer ${token.access_token}`,
							'Content-Type': 'application/json',
							Accept: 'application/json, text/plain, */*'
						},
						credentials: 'include',
						body: JSON.stringify(value)
					})
						.then(response => response.json() as Promise<Bearer | ErrorMessage>)
						.then(data => {
							if ((data as ErrorMessage).error) {
								if (error) {
									error(data as ErrorMessage);
								}
							} else {
								removeToken();
								let BearerToken: Bearer | undefined = decodeToken(data);
								dispatch({
									type: 'RECEIVE_TOKEN',
									username: BearerToken?.name ?? '',
									token: BearerToken
								});
								if (BearerToken) saveToken(BearerToken);
								if (callback) {
									callback();
								}
							}
						})
						.catch(err => {
							const token = unloadedTokenState();
							dispatch({
								type: 'RECEIVE_TOKEN',
								token: token,
								username: token.name || ''
							});
						});
					dispatch({ type: 'REQUEST_TOKEN', username: value.confirmedEmail ?? '' });
				}
			}
		},
	confirmEmail:
		(
			value: ConfirmEmailViewModel,
			callback?: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async (dispatch, getState) => {
			await fetch('/Account/ConfirmEmail', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, text/plain, */*'
				},
				credentials: 'include',
				body: JSON.stringify(value)
			})
				.then(response => response.json() as Promise<Bearer | ErrorMessage>)
				.then(data => {
					if ((data as ErrorMessage).error) {
						if (error) {
							error(data as ErrorMessage);
						}
					} else {
						removeToken();
						let BearerToken: Bearer | undefined = decodeToken(data);
						dispatch({
							type: 'RECEIVE_TOKEN',
							username: BearerToken?.name ?? '',
							token: BearerToken
						});
						if (BearerToken) saveToken(BearerToken);
						if (callback) {
							callback();
						}
					}
				})
				.catch(err => {
					const token = unloadedTokenState();
					dispatch({
						type: 'RECEIVE_TOKEN',
						token: token,
						username: token.name || ''
					});
				});
		},
	confirmRegistrationEmail:
		(
			value: ConfirmRegistrationViewModel,
			callback?: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async (dispatch, getState) => {
			await fetch('/Account/ConfirmRegistrationEmail', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, text/plain, */*'
				},
				body: JSON.stringify(value)
			})
				.then(response => response.json() as Promise<Bearer | ErrorMessage>)
				.then(data => {
					if ((data as ErrorMessage).error) {
						if (error) {
							error(data as ErrorMessage);
						}
					} else {
						removeToken();
						let BearerToken: Bearer | undefined = decodeToken(data);
						dispatch({
							type: 'RECEIVE_TOKEN',
							username: BearerToken?.name ?? '',
							token: BearerToken
						});
						if (BearerToken) saveToken(BearerToken);
						if (callback) {
							callback();
						}
					}
				})
				.catch(err => {
					const token = unloadedTokenState();
					dispatch({
						type: 'RECEIVE_TOKEN',
						token: token,
						username: token.name || ''
					});
				});
		}
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
let username: string = '';
let token = unloadedTokenState();
const unloadedState: AccountState = {
	token: token,
	isRequiredToken: false,
	username: username,
	isRequiredRefreshOnClient: false,
	isLoading: false
};

export const reducer: Reducer<AccountState> = (
	state: AccountState | undefined,
	incomingAction: Action
) => {
	if (state === undefined) {
		return unloadedState;
	}
	const action = incomingAction as KnownAction | LogoutAction;
	switch (action.type) {
		case 'REQUEST_TOKEN':
			return {
				username: action.username,
				token: state.token,
				isRequiredToken: state.isRequiredToken,
				isRequiredRefreshOnClient: false,
				isLoading: true
			};
		case 'RECEIVE_TOKEN':
			return {
				token: action.token,
				username: action.username,
				isRequiredToken: false,
				isRequiredRefreshOnClient: false,
				isLoading: false
			};
		case 'LOGOUT':
			return {
				isRequiredToken: true,
				isRequiredRefreshOnClient: true,
				isLoading: false
			};
		case 'REQUEST_VERIFICATION':
			return {
				isRequiredToken: false,
				isRequiredRefreshOnClient: false,
				isLoading: false
			};
		case 'RECEIVE_VERIFICATION':
			return {
				isRequiredToken: false,
				isRequiredRefreshOnClient: false,
				isLoading: false
			};
		default:
			// The following line guarantees that every action in the KnownAction union has been covered by a case above
			const exhaustiveCheck: never = action;
	}

	return state;
};
