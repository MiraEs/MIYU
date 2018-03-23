import { createAction } from 'redux-actions';

const _constaints = {
	REFERENCE_SET_REFERENCE: 'REFERENCE_SET_REFERENCE',
	REFERENCE_MODAL: 'modal',
};

export const {
	REFERENCE_SET_REFERENCE,
	REFERENCE_MODAL,
} = _constaints;

export const setReference = createAction(_constaints.REFERENCE_SET_REFERENCE, (component, reference) => {
	return { component, reference };
});
