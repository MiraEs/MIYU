import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
} from 'react-native';
import styles from '../lib/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	Button,
	Text,
} from 'BuildLibrary';
import {
	loginWithCreds,
	setImpersonatorId,
	signUserOut,
} from '../actions/UserActions';
import TrackingActions from '../lib/analytics/TrackingActions';
import Form from '../components/Form';
import FormInput from '../components/FormInput';
import store from 'react-native-simple-store';
import { IMPERSONATOR_PASSWORD } from '../constants/constants';

const componentStyles = StyleSheet.create({
	button: {
		flex: 0,
		width: 200,
		margin: styles.measurements.gridSpace1,
	},
	container: {
		alignItems: 'center',
	},
	message: {
		alignItems: 'center',
		margin: styles.measurements.gridSpace1,
	},
	input: {
		borderColor: styles.colors.secondary,
		borderWidth: styles.measurements.borderWidth,
		width: 100,
		alignSelf: 'center',
		height: 30,
	},
	form: {
		flex: 0,
		width: 200,
	},
});

export class CustomerImpersonator extends Component {

	constructor(props) {
		super(props);
		this.state = {
			customerId: null,
			inputPassword: null,
			password: null,
		};
	}

	componentDidMount() {
		store.get(IMPERSONATOR_PASSWORD).then((password) => {
			this.setState({ password });
		}).done();
	}

	onChange = ({ customerId, inputPassword }) => {
		if (customerId) {
			this.setState({
				customerId: customerId.value,
				error: '',
			});
		}
		if (inputPassword) {
			this.setState({
				inputPassword: inputPassword.value,
				error: '',
			});
		}
	};

	logout = () => {
		this.props.actions.signUserOut();
	};

	login = () => {
		const { loginWithCreds, setImpersonatorId } = this.props.actions;
		setImpersonatorId(parseInt(this.state.customerId, 10));
		loginWithCreds('admin', this.state.password || this.state.inputPassword, false)
		.then(() => {
			if (!this.state.password) {
				this.setState({ password: this.state.inputPassword });
			}
			store.save(IMPERSONATOR_PASSWORD, this.state.inputPassword);
		})
		.catch((error) => this.setState({ error: error.message }))
		.done();
	};

	renderMessage = () => {
		const { impersonatorId, user } = this.props;
		if (impersonatorId) {
			return (
				<Text
					stlye={componentStyles.message}
				>
					Impersonating
					<Text weight="bold"> {user.firstName} {user.lastName}</Text>
					.
				</Text>
			);
		} else {
			return <Text stlye={componentStyles.message}>You need to log out first.</Text>;
		}
	};

	renderPasswordInput = () => {
		if (!this.state.password) {
			return (
				<FormInput
					autoCapitalize="none"
					name="inputPassword"
					label="Admin Password"
					accessibilityLabel="Impersonator Password Input"
				/>
			);
		}
	};

	renderScreenContent = () => {
		const { isLoggedIn } = this.props;
		if (isLoggedIn) {
			return (
				<View style={componentStyles.message}>
					{this.renderMessage()}
					<Button
						style={componentStyles.button}
						text="Logout"
						color="white"
						textColor="secondary"
						trackAction={TrackingActions.CUSTOMER_IMPERSONATOR_LOGOUT}
						accessibilityLabel="Customer Impersonator Logout"
						onPress={this.logout}
					/>
				</View>
			);
		}
		return (
			<Form
				style={componentStyles.form}
				onChange={this.onChange}
			>
				<FormInput
					name="customerId"
					label="Customer ID"
					accessibilityLabel="Customer Id Input"
				/>
				{this.renderPasswordInput()}
				<Button
					key="customerImpersonatorLoginButton"
					isLoading={this.props.isLoggingIn}
					text="Impersonate"
					color="primary"
					onPress={this.login}
					accessibilityLabel="Customer Impersonator Login"
					trackAction={TrackingActions.CUSTOMER_IMPERSONATOR_LOGIN}
				/>
				<Text color="error">{this.state.error}</Text>
			</Form>
		);
	};

	render() {
		return (
			<View style={[styles.elements.screenWithHeader, componentStyles.container]}>
				{this.renderScreenContent()}
			</View>
		);
	}

}

CustomerImpersonator.propTypes = {
	actions: PropTypes.object,
	isLoggedIn: PropTypes.bool,
	isLoggingIn: PropTypes.bool,
	impersonatorId: PropTypes.number,
	user: PropTypes.object,
};

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.userReducer.isLoggedIn,
		isLoggingIn: state.userReducer.isLoggingIn,
		impersonatorId: state.userReducer.impersonatorId,
		user: state.userReducer.user,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions: bindActionCreators({
			signUserOut,
			loginWithCreds,
			setImpersonatorId,
		}, dispatch),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CustomerImpersonator);
