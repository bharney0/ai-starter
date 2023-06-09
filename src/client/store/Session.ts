import { Action, Reducer } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppState, AppThunkAction, TypedDispatch, useAppDispatch, useAppSelector } from '.';
import { Bearer, ErrorMessage } from '../models';
import { decodeToken, removeToken, saveToken, unloadedTokenState } from '../utils/TokenUtility';
import { AnyAction } from '@reduxjs/toolkit';
// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface SessionState {
	username?: string;
	token?: Bearer;
	isRequiredToken: boolean;
	isRequiredRefreshOnClient?: boolean;
	isLoading: boolean;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequiredTokenAction extends Action {
	type: 'REQUIRED_TOKEN';
	username?: string;
	token?: Bearer;
}

interface ReceiveTokenAction extends Action {
	type: 'RECEIVE_TOKEN';
	username?: string;
	token?: Bearer;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
export type KnownAction = RequiredTokenAction | ReceiveTokenAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).
export const actionCreators = {
	requiredToken: (): AppThunkAction<RequiredTokenAction> => dispatch => {
		let bearerFromStore: Bearer = unloadedTokenState();
		dispatch({
			type: 'REQUIRED_TOKEN',
			username: bearerFromStore.name || '',
			token: bearerFromStore
		});
	},
	loadToken: (callback?: () => AnyAction): AnyAction => {
		let bearerFromStore: Bearer = unloadedTokenState();
		if (callback) {
			const dispatch = useAppDispatch();
			dispatch({
				type: 'RECEIVE_TOKEN',
				username: bearerFromStore.name || '',
				token: bearerFromStore
			});
			return callback();
		} else {
			return {
				type: 'RECEIVE_TOKEN',
				username: bearerFromStore.name || '',
				token: bearerFromStore
			};
		}
	},
	getToken:
		(callback?: () => void): AppThunkAction<{}> =>
		async dispatch => {
			await fetch('/Account/GetToken', {
				method: 'get',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json, text/plain, */*'
				},
				credentials: 'include'
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
					let token: Bearer = unloadedTokenState();
					dispatch({ type: 'RECEIVE_TOKEN', token: token, username: '' });
				});
			dispatch({ type: 'REQUEST_TOKEN' });
		}
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

let username: string = '';
let token: Bearer = unloadedTokenState();
const unloadedState: SessionState = {
	token: token,
	isRequiredToken: false,
	username: username,
	isRequiredRefreshOnClient: false,
	isLoading: false
};

// fixme: add reducer
export const reducer: Reducer<SessionState> = (
	state: SessionState | undefined,
	incomingAction: Action
): SessionState => {
	if (state === undefined) {
		return unloadedState;
	}
	const action = incomingAction as KnownAction;
	switch (action.type) {
		case 'REQUIRED_TOKEN':
			return {
				token: action.token,
				username: action.username,
				isRequiredToken: true,
				isRequiredRefreshOnClient: false,
				isLoading: false
			};
		case 'RECEIVE_TOKEN':
			return {
				token: action.token,
				username: action.username,
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
