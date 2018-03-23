import { create } from 'react-test-renderer';
import React from 'react';
import 'react-native';
import EventEmitter from '../../lib/eventEmitter';
import userActions from '../../actions/UserActions';
import { showAlert } from '../../actions/AlertActions';
import {
	ProRegistrationScreen,
	mapStateToProps,
	mapDispatchToProps,
} from '../ProRegistrationScreen';
import UtilityActions from '../../actions/UtilityActions';

jest.unmock('react-native');
jest.mock('BuildLibrary');
jest.mock('../../actions/UtilityActions', () => ({
	getZipCodeInfo: jest.fn((zip) => {
		if (zip === 95928) {
			return {
				city: 'Chico',
				stateAbbr: 'CA',
				country: 'US',
			};
		}
		// pretend any other zip code doesn't exist
		return {};
	}),
}));
jest.mock('../../styles/navigationBarStyles', () => ({
	navigationBarLight: {},
}));
jest.mock('../../actions/UserActions', () => ({
	create: jest.fn(),
	saveCustomerAddress: jest.fn(),
	saveProfessionalData: jest.fn(),
	saveUserAnswers: jest.fn(),
}));
jest.mock('../../actions/AlertActions', () => ({
	showAlert: jest.fn(),
}));
jest.mock('../../lib/styles', () => ({
	measurements: {
		gridSpace1: 7,
		gridSpace2: 14,
	},
	dimensions: {
		borderWidth: 1,
		tapSizeMedium: 44,
	},
	fonts: {
		mainRegular: 'main-regular',
	},
	colors: {
		white: 'white',
	},
}));
jest.mock('../FormInput', () => 'FormInput');
jest.mock('../Form', () => 'Form');
jest.mock('../DropDown', () => 'DropDown');
jest.mock('../../lib/eventEmitter', () => ({
	emit: jest.fn(),
}));
jest.mock('.././FixedBottomButton', () => 'FixedBottomButton');
jest.mock('../../lib/analytics/TrackingActions', () => ({}));
jest.mock('../FormErrorMessage', () => 'FormErrorMessage');
jest.mock('../../lib/Validations', () => ({
	isValidUSZipcode: jest.fn(() => true),
	isValidPhoneNumber: jest.fn(() => true),
	isValidCanadianZipcode: jest.fn(() => true),
}));
jest.mock('redux');
jest.mock('react-redux');
jest.mock('../../constants/proQuestionnaireConstants', () => ({
	PROFESSION_ANSWER: 'PROFESSION_ANSWER',
	CONSUMER_OR_PROFESSIONAL_QUESTION: 'CONSUMER_OR_PROFESSIONAL_QUESTION',
	QUESTIONNAIRE: 'QUESTIONNAIRE',
	SECTION: 'SECTION',
}));
jest.mock('../navigationBar/NavigationBarIconButton', () => 'NavigationBarIconButton');
jest.mock('../../lib/helpers', () => ({}));
jest.mock('../../actions/NavigatorActions', () => ({}));


const props = {
	customerId: 123,
	email: 'email',
	firstName: 'first name',
	lastName: 'last name',
	password: 'password',
	isGuest: false,
	actions: {
		create: jest.fn(() => ({
			catch: jest.fn(() => ({
				done: jest.fn(),
			})),
		})),
		getZipCodeInfo: UtilityActions.getZipCodeInfo,
		saveProfessionalData: jest.fn(),
		showAlert: jest.fn(),
		saveCustomerAddress: jest.fn(),
		saveUserAnswers: jest.fn(),
	},
	navigator: {
		push: jest.fn(),
	},
};

function setup(otherProps = {}) {
	const wrapper = create(
		<ProRegistrationScreen
			{...props}
			{...otherProps}
		/>
	);
	const instance = wrapper.getInstance();
	return {
		wrapper,
		instance,
	};
}

describe('ProRegistrationScreen', () => {
	it('should render with full props', () => {
		const { wrapper } = setup();
		expect(wrapper.toJSON()).toMatchSnapshot();
	});
	it('should track the screen', () => {
		const proRegistrationScreen = new ProRegistrationScreen();
		const result = proRegistrationScreen.setScreenTrackingInformation();
		expect(result).toEqual({
			name: 'build:app:proregistration',
		});
	});
	it('should handle selecting a profession', () => {
		const { instance } = setup();
		instance.onSelectProfession('test profession');
		expect(instance.state).toEqual({
			companyCountry: 'US',
			profession: 'test profession',
			professionErrorMessage: '',
			isLoading: false,
		});
	});
	describe('onPressSubmit', () => {
		afterEach(() => {
			UtilityActions.getZipCodeInfo.mockClear();
			props.actions.saveCustomerAddress.mockClear();
			props.actions.saveProfessionalData.mockClear();
			props.actions.saveUserAnswers.mockClear();
		});
		it('should handle a valid zip', async () => {
			const { instance } = setup();
			instance.setState({
				profession: 'Testing',
				companyZipCode: '95928',
				companyCity: 'Chico',
				companyStateAbbr: 'CA',
				companyCountry: 'US',
			});
			await instance.onPressSubmit();
			expect(props.actions.saveCustomerAddress).toBeCalled();
			expect(props.actions.saveProfessionalData).toBeCalled();
			expect(props.actions.saveUserAnswers).toBeCalled();
		});
		it('should handle an invalid zip', async () => {
			const { instance } = setup();
			instance.setState({ companyZipCode: 11111 });
			const spy = jest.spyOn(instance, 'notifyUserErrors');
			await instance.onPressSubmit();
			expect(spy).toBeCalled();
			expect(props.actions.saveCustomerAddress).not.toBeCalled();
			expect(props.actions.saveProfessionalData).not.toBeCalled();
			expect(props.actions.saveUserAnswers).not.toBeCalled();
		});
	});
	it('should handle pressing profession dropdown', () => {
		const { instance } = setup();
		instance.onPressProfessionDropDown();
		expect(EventEmitter.emit).toBeCalled();
	});
	it('should handle form values changing', () => {
		const { instance } = setup();
		instance.onChangeFormValues({
			one: {
				value: 'one',
			},
			two: {
				value: 'three',
			},
		});
		expect(instance.state).toEqual({
			companyCountry: 'US',
			isLoading: false,
			one: 'one',
			profession: '',
			professionErrorMessage: '',
			two: 'three',
		});
	});
	it('should validate with no profession', () => {
		const { instance } = setup();
		instance.form = {
			triggerValidation: jest.fn(),
		};
		const result = instance.validate();
		expect(result).toEqual(false);
		expect(instance.state).toEqual({
			companyCountry: 'US',
			isLoading: false,
			profession: '',
			professionErrorMessage: 'Profession is required.',
			stateErrorMessage: 'Company state is required.',
		});
	});
	it('should validate with profession', () => {
		const { instance } = setup();
		instance.form = {
			triggerValidation: jest.fn(() => true),
		};
		instance.state.profession = 'test profession';
		instance.state.companyStateAbbr = 'CA';
		const result = instance.validate();
		expect(result).toEqual(true);
		expect(instance.state).toEqual({
			companyCountry: 'US',
			companyStateAbbr: 'CA',
			isLoading: false,
			profession: 'test profession',
			professionErrorMessage: '',
		});
	});
	it('should validate zip code', () => {
		const { instance } = setup();
		const result = instance.validateZipCode(65432);
		expect(result).toEqual(true);
	});
	it('should validate phone number', () => {
		const { instance } = setup();
		const result = instance.validatePhone(6543216543);
		expect(result).toEqual(true);
	});
	it('should notify users', () => {
		const { instance } = setup();
		instance.notifyUserErrors('test message');
		expect(instance.props.actions.showAlert).toBeCalledWith(
			'test message',
			'error'
		);
	});
	it('should mapStateToProps', () => {
		const result = mapStateToProps({
			userReducer: {
				user: {
					customerId: 1234,
				},
			},
		});
		expect(result).toEqual({
			customerId: 1234,
		});
	});
	it('should mapDispatchToProps', () => {
		const dispatch = jest.fn((fn) => fn);
		const result = mapDispatchToProps(dispatch);
		expect(result).toEqual({
			actions: {
				create: userActions.create,
				getZipCodeInfo: UtilityActions.getZipCodeInfo,
				saveCustomerAddress: userActions.saveCustomerAddress,
				saveProfessionalData: userActions.saveProfessionalData,
				saveUserAnswers: userActions.saveUserAnswers,
				showAlert,
			},
		});
	});
});
