import { Action, Reducer } from 'redux';
import { Bearer, ErrorMessage, ProfileViewModel } from '../models';
import toFormData from '../utils/FormDataUtility';
import { AppThunkAction } from './';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ProfileState {
	isLoading: boolean;
	profile?: ProfileViewModel;
	profiles?: ProfileViewModel[];
	token?: Bearer;
	isRequiredToken: boolean;
	isRequiredRefreshOnClient?: boolean;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
interface RequestProfileAction {
	type: 'REQUEST_PROFILE';
}

interface ReceiveProfileAction {
	type: 'RECEIVE_PROFILE';
	profile?: ProfileViewModel;
}

interface ReceiveProfilesAction {
	type: 'RECEIVE_PROFILES';
	profiles?: ProfileViewModel[];
}

interface SubmitProfileAction {
	type: 'SUBMIT_PROFILE';
	profile?: ProfileViewModel;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction =
	| RequestProfileAction
	| ReceiveProfilesAction
	| ReceiveProfileAction
	| SubmitProfileAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
	getProfile: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
		let token = getState().session.token;
		if (token) {
					dispatch({ type: 'RECEIVE_PROFILE', profile: undefined });

			// await fetch('/CreateDocument', {
			// 	method: 'post',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		Accept: 'application/json, text/plain, */*'
			// 	}
			// })
			// 	.then(response => response.json() as Promise<ProfileViewModel | ErrorMessage>)
			// 	.then(data => {
			// 		if ((data as ErrorMessage).error) {
			// 			dispatch({ type: 'RECEIVE_PROFILE', profile: undefined });
			// 		} else {
			// 			dispatch({
			// 				type: 'RECEIVE_PROFILE',
			// 				profile: data as ProfileViewModel
			// 			});
			// 		}
			// 	})
			// 	.catch(err => {
			// 		dispatch({ type: 'RECEIVE_PROFILE', profile: undefined });
			// 	});
			// dispatch({ type: 'REQUEST_PROFILE' });
		}
	},
	getProfiles: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
		let token = getState().session.token;
		if (token) {
			await fetch('/Manage/List', {
				method: 'get',
				headers: {
					Authorization: `Bearer ${token.access_token}`,
					'Content-Type': 'application/json',
					Accept: 'application/json, text/plain, */*'
				}
			})
				.then(response => response.json() as Promise<ProfileViewModel[] | ErrorMessage>)
				.then(data => {
					if ((data as ErrorMessage).error) {
						dispatch({ type: 'RECEIVE_PROFILES', profiles: undefined });
					} else {
						dispatch({
							type: 'RECEIVE_PROFILES',
							profiles: data as ProfileViewModel[]
						});
					}
				})
				.catch(err => {
					dispatch({ type: 'RECEIVE_PROFILES', profiles: undefined });
				});
			dispatch({ type: 'REQUEST_PROFILE' });
		}
	},
	updateProfile:
		(
			value: ProfileViewModel,
			callback: () => void,
			error?: (error: ErrorMessage) => void
		): AppThunkAction<KnownAction> =>
		async (dispatch, getState) => {
			let token = getState().session.token;
			if (token) {
				let data = toFormData(value, undefined, undefined);
				if (value.imageUrl) {
					if (value.imageUrl) {
						data.append('type', 'file');
						data.append('ImageUrl', value.imageBlob as Blob);
					}
				}
				await fetch('/Manage/Index', {
					headers: {
						Authorization: `Bearer ${token.access_token}`,
						Accept: 'application/json, text/plain, */*'
					},
					method: 'POST',
					body: data
				})
					.then(response => response.json() as Promise<ProfileViewModel | ErrorMessage>)
					.then(data => {
						if ((data as ErrorMessage).error) {
							dispatch({ type: 'RECEIVE_PROFILE', profile: undefined });
						} else {
							dispatch({
								type: 'RECEIVE_PROFILE',
								profile: data as ProfileViewModel
							});
							callback();
						}
					})
					.catch(err => {
						if (error) {
							error(err as ErrorMessage);
						}
						dispatch({ type: 'RECEIVE_PROFILE', profile: undefined });
					});
				dispatch({ type: 'SUBMIT_PROFILE', profile: value });
			}
		}
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

///Todo Update SessionStorage
let bearerFromStore: Bearer = {};
let username: string = '';
let profile: ProfileViewModel = {};
if (typeof window !== 'undefined') {
	if (window.sessionStorage) {
		username = (<any>window).sessionStorage.username;
		bearerFromStore = JSON.parse((<any>window).sessionStorage.jwt || '{}');
	} else if (window.localStorage) {
		username = (<any>window).localStorage.username;
		bearerFromStore = JSON.parse((<any>window).localStorage.jwt || '{}');
	}
}

const unloadedState: ProfileState = {
	isLoading: false,
	profile: profile,
	profiles: [],
	token: bearerFromStore.access_token ? bearerFromStore : undefined,
	isRequiredToken: false,
	isRequiredRefreshOnClient: true
};

export const reducer: Reducer<ProfileState> = (
	state: ProfileState | undefined,
	incomingAction: Action
) => {
	if (state === undefined) {
		return unloadedState;
	}
	const action = incomingAction as KnownAction;
	switch (action.type) {
		case 'REQUEST_PROFILE':
			return {
				isLoading: true,
				profile: state.profile,
				token: state.token,
				isRequiredToken: state.isRequiredToken,
				isRequiredRefreshOnClient: false
			};
		case 'RECEIVE_PROFILE':
			return {
				isLoading: false,
				profile: action.profile,
				token: state.token,
				isRequiredToken: false,
				isRequiredRefreshOnClient: false
			};
		case 'RECEIVE_PROFILES':
			return {
				isLoading: false,
				profiles: action.profiles,
				token: state.token,
				isRequiredToken: false,
				isRequiredRefreshOnClient: false
			};
		case 'SUBMIT_PROFILE':
			return {
				isLoading: false,
				profile: action.profile,
				token: state.token,
				isRequiredToken: false,
				isRequiredRefreshOnClient: false
			};
		default:
			// The following line guarantees that every action in the KnownAction union has been covered by a case above
			const exhaustiveCheck: never = action;
	}

	return state;
};
