import SessionService from '../services/SessionService';
import store from 'react-native-simple-store';
import {
	GET_SESSION,
	GET_SESSION_ERROR,
	SAVE_SESSION,
	SAVE_SESSION_ERROR,
	CID,
} from '../constants/SessionConstants';

const defaultSession = {
	properties: {
		session : {},
	},
};

function getSessionError(payload) {
	return {
		type: GET_SESSION_ERROR,
		payload,
	};
}

function saveSessionError(payload) {
	return {
		type: SAVE_SESSION_ERROR,
		payload,
	};
}

export function getSession(cid) {
	return (dispatch) => {
		return new Promise((resolve, reject) => {
			SessionService.getSession({cid}).then((session) => {
				dispatch({
					type: GET_SESSION,
					payload: session,
				});
				resolve(session);
			}).then(null, (error) => {
				dispatch(getSessionError(error));
				reject(error);
			});
		});
	};
}

export function saveSession(request = defaultSession) {
	return (dispatch) => {
		return new Promise((resolve, reject) => {
			SessionService.saveSession(request).then((session) => {
				store.save(CID, session.cid);
				dispatch({
					type: SAVE_SESSION,
					payload: session,
				});
				resolve(session);
			}).then(null, (error) => {
				saveSessionError(error);
				reject(error);
			});
		});
	};
}
