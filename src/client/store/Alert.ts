import { ThunkDispatch, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Alert, AlertType, AnimationState } from '../models';
import { AppState, ApplicationState, useAppDispatch, useAppSelector } from '.';
export interface AlertState {
	items: Alert[];
}
let internalIndex = 0;
const enteringDuration = 100;
const exitingDuration = 100;
const existedDuration = 100;
const autoCloseDuration = 5000;
const preventRepeat = true;

interface AlertAction {
	type: 'SEND_ALERT';
	id: number;
	message?: React.ReactNode | string;
	alertType: AlertType;
}

export interface CloseAlertAction {
	type: 'CLOSE_ALERT';
	id: number;
}

interface StartAnimateAction {
	type: 'START_ANIMATE';
	id: number;
	state: AnimationState;
}

export type KnownAction = AlertAction | CloseAlertAction | StartAnimateAction;

export const closeAlert = createAsyncThunk(
	'CLOSE_ALERT',
	async ({ index }: { index: number }, { dispatch }) => {
		dispatch({ type: 'START_ANIMATE', id: index, state: AnimationState.exiting });
		setTimeout(() => {
			dispatch({ type: 'START_ANIMATE', id: index, state: AnimationState.exited });
		}, exitingDuration);
		setTimeout(() => {
			dispatch({ type: 'CLOSE_ALERT', id: index });
		}, exitingDuration + existedDuration);
	}
);

export const sendAlert = createAsyncThunk(
	'SEND_ALERT',
	async (
		{
			message,
			alertType,
			autoClose
		}: {
			message: React.ReactNode | string;
			alertType: AlertType;
			autoClose: boolean;
		},
		{ dispatch, getState }
	) => {
		const state: ApplicationState = getState() as unknown as ApplicationState;
		const { alert } = state;
		if (alert.items.length < 1 && preventRepeat) {
			dispatch({ type: 'SEND_ALERT', id: internalIndex, message, alertType });
			const currentIndex = internalIndex;
			setTimeout(() => {
				dispatch({ type: 'START_ANIMATE', id: currentIndex, state: AnimationState.entered });
			}, enteringDuration);
			if (autoClose) {
				setTimeout(() => {
					dispatch({ type: 'START_ANIMATE', id: currentIndex, state: AnimationState.exiting });
				}, autoCloseDuration);
				setTimeout(() => {
					dispatch({ type: 'START_ANIMATE', id: currentIndex, state: AnimationState.exited });
				}, autoCloseDuration + exitingDuration);
				setTimeout(() => {
					dispatch({ type: 'CLOSE_ALERT', id: currentIndex });
				}, autoCloseDuration + exitingDuration + existedDuration);
			}
			internalIndex++;
		}
	}
);

const actionCreators = { closeAlert, sendAlert };

const initialState: AlertState = { items: [] };
export const alertSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		['SEND_ALERT']: (state, action) => {
			if (state.items.length < 1 && preventRepeat) {
				const { message, alertType } = action.payload;
				state.items.push({ id: internalIndex, message, alertType, state: AnimationState.entering });
				internalIndex++;
			}
			return state;
		},
		['START_ANIMATE']: (state, action) => {
			const { id, state: animationState } = action.payload;
			state.items.map(item => {
				if (item.id === id) {
					item.state = animationState;
				}
				return item;
			});
			return state;
		},
		['CLOSE_ALERT']: (state, action) => {
			const { id } = action.payload;
			state.items.filter(value => value.id !== id);
			return state;
		}
	}
});

const { reducer } = alertSlice;
export default { reducer, actionCreators };
