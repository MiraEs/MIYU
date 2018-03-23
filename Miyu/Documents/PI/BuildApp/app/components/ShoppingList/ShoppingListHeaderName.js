import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	ActionSheetIOS,
	StyleSheet,
	TouchableHighlight,
	View,
	ViewPropTypes,
} from 'react-native';
import {
	LinkButton,
	Text,
} from 'BuildLibrary';
import Form from '../Form';
import FormInput from '../FormInput';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../lib/styles';
import helpers from '../../lib/helpers';
import TrackingActions from '../../lib/analytics/TrackingActions';
import { trackAction } from '../../actions/AnalyticsActions';
import store from '../../store/configStore';
import { showAlert } from '../../actions/AlertActions';
import EventEmitter from '../../lib/eventEmitter';

const componentStyles = StyleSheet.create({
	nameTouchable: {
		paddingHorizontal: styles.measurements.gridSpace1,
		borderRadius: 3,
		flex: 1,
	},
	name: {
		minWidth: 44,
		marginHorizontal: styles.measurements.gridSpace2,
	},
	form: {
		marginHorizontal: styles.measurements.gridSpace2,
	},
	inputContainer: {
		marginVertical: 0,
		paddingHorizontal: 7,
	},
	input: {
		height: 30,
		paddingVertical: 2,
	},
	inputErrorStyle: {
		marginBottom: 0,
	},

	mainWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: styles.colors.greyLight,
		height: 44,
		paddingHorizontal: styles.measurements.gridSpace2,
		borderColor: styles.colors.grey,
		borderWidth: styles.dimensions.borderWidth,
	},
	emptyGroupWrapper: {
		backgroundColor: styles.colors.greyLight,
		borderColor: styles.colors.grey,
		borderWidth: styles.dimensions.borderWidth,
		marginTop: -1,
		paddingHorizontal: styles.measurements.gridSpace2,
		paddingVertical: styles.measurements.gridSpace2,
		flexDirection: 'row',
		alignItems: 'center',
	},
	mockPicture: {
		borderWidth: styles.dimensions.borderWidth,
		borderColor: styles.colors.greyDark,
		borderStyle: 'dashed',
		width: 50,
		height: 50,
		marginRight: styles.measurements.gridSpace2,
	},
});

class ShoppingListHeaderName extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEditing: props.isEditing,
			isCollapsed: false,
			name: props.name,
		};
	}

	componentDidMount() {
		if (this.props.isEditing) {
			this.onPress();
		}
	}

	componentWillReceiveProps(nextProps) {
		const newState = {};
		let focusCallback = null;
		if (nextProps.isEditing !== this.props.isEditing) {
			newState.isEditing = nextProps.isEditing;
			focusCallback = () => this.focus();
		}
		if (this.isNameChanged(nextProps)) {
			newState.name = nextProps.name;
		}
		if (Object.keys(newState).length) {
			this.setState(newState, focusCallback);
		}
	}

	componentWillUnmount() {
		this._name = null;
	}

	handleChange = ({ name: { value: name } }) => {
		this.setState({ name });
	};

	onBlur = () => {
		this.setState({
			isEditing: false,
			name: this.props.name,
		});
		this.props.onBlur();
	};

	onSubmitEditing = () => {
		const validName = this._name && this._name._form && this._name._form.name.isValid();
		if (validName) {
			this.setState({ isEditing: false }, () => {
				if (this.isNameChanged() || this.props.isNew) {
					store.dispatch(trackAction(TrackingActions.SHOPPING_LIST_UPDATE_LIST_NAME));
					this.props.onSaveName(this.state.name.trim())
						.catch((error) => {
							store.dispatch(showAlert(error.message, 'error'));
							this.onPress();
						})
						.done();
				}
			});
		} else {
			this.focus();
		}
	};

	onPress = () => {
		this.setState({ isEditing: true }, this.focus);
	};

	isNameChanged = (props = this.props) => {
		return this.state.name !== props.name;
	};

	focus = () => {
		this._name && this._name._form && this._name._form.name.focus();
	};

	validateNewName = () => {
		return !this.isNameChanged() || this.props.validateNewName(this.state.name);
	};

	onSendGroupToCartPress = () => {
		store.dispatch(trackAction(TrackingActions.SHOPPING_LIST_ADD_GROUP_TO_CART_TAP));
		this.props.onSendGroupToCartPress();
	};

	onDeleteGroupPress = () => {
		store.dispatch(trackAction(TrackingActions.SHOPPING_LIST_DELETE_GROUP_TAP));
		this.props.onDeleteGroupPress();
	};

	onMoreOptionsPress = () => {
		let buttons = [
			// { text: 'Download Spec Sheet', onPress: helpers.noop },
			// { text: 'Add To Another Project', onPress: this.onSaveCartModal },
			{ text: 'Delete Group', onPress: this.onDeleteGroupPress },
			{ text: 'Cancel', onPress: helpers.noop },
		];
		if (!this.props.isSectionEmpty) {
			buttons = [
				{ text: 'Add Group to Cart', onPress: this.onSendGroupToCartPress },
				...buttons,
			];
		}

		if (helpers.isIOS()) {
			ActionSheetIOS.showActionSheetWithOptions({
				options: buttons.map((button) => button.text),
				cancelButtonIndex: buttons.length - 1,
				tintColor: styles.colors.secondary,
			}, (index) => {
				buttons[index].onPress();
			});
		} else {
			delete buttons[buttons.length - 1];
			EventEmitter.emit('showActionSheet', {
				title: 'Group Options',
				options: buttons,
			});
		}
	};

	renderEmptyGroup = () => {
		if (this.props.isSectionEmpty && !this.state.isCollapsed) {
			return (
				<View style={componentStyles.emptyGroupWrapper}>
					<View style={componentStyles.mockPicture} />
					<Text style={styles.elements.flex1}>
						Add items to your list by tapping <Text weight="bold">
						Add to Project
					</Text> on any product page.
					</Text>
				</View>
			);
		}
	};

	renderHeaderName = () => {
		if (this.state.isEditing) {
			return (
				<Form
					ref={(c) => this._name = c}
					alternateScrollHandle={this.props.scrollHandle}
					inputFocusOffset={20}
					onChange={this.handleChange}
					scrollsToTop={true}
					style={componentStyles.form}
				>
					<FormInput
						accessibilityLabel="name"
						autoCapitalize="words"
						errorStyle={componentStyles.inputErrorStyle}
						inputStyle={componentStyles.input}
						label=""
						name="name"
						returnKeyType="done"
						textInputContainerStyle={componentStyles.inputContainer}
						validateOnBlur={true}
						validateOnChange={false}
						validationFunction={this.validateNewName}
						value={this.state.name}
						onSubmitEditing={this.onSubmitEditing}
						onBlur={this.onBlur}
					/>
				</Form>
			);
		}

		const { name } = this.state;
		const safeName = name ? name : '';

		return (
			<TouchableHighlight
				onPress={this.onPress}
				underlayColor="rgba(255, 255, 255, 0.05)"
				style={componentStyles.nameTouchable}
				accessibilityLabel="Header name"
			>
				<Text
					style={componentStyles.name}
					family="archer"
					weight="bold"
					size="large"
				>
					{safeName}
				</Text>
			</TouchableHighlight>
		);
	};

	renderHeader = () => {
		const { isCollapsed } = this.state;
		return (
			<View style={componentStyles.mainWrapper}>
				<LinkButton
					onPress={() => {
						const collapsed = !isCollapsed;
						this.setState({ isCollapsed: collapsed});
						this.props.onCollapse(collapsed);
					}}
					style={componentStyles.collapseButton}
					wrapChildren={false}
				>
					<Icon
						color={styles.colors.secondary}
						name={helpers.getIcon(isCollapsed ? 'add' : 'remove')}
						size={28}
					/>
				</LinkButton>
				{this.renderHeaderName()}
				<LinkButton
					onPress={this.onMoreOptionsPress}
					wrapChildren={false}
				>
					<Icon
						color={styles.colors.secondary}
						name={helpers.getIcon('more')}
						size={30}
					/>
				</LinkButton>
			</View>
		);
	};

	render() {
		if (this.props.isSectionEmpty && !this.state.isCollapsed) {
			return (
				<View>
					{this.renderHeader()}
					{this.renderEmptyGroup()}
				</View>
			);
		}
		return this.renderHeader();
	}
}

ShoppingListHeaderName.propTypes = {
	isEditing: PropTypes.bool,
	isNew: PropTypes.bool,
	isSectionEmpty: PropTypes.bool,
	name: PropTypes.string,
	onBlur: PropTypes.func,
	onSaveName: PropTypes.func,
	scrollHandle: PropTypes.object,
	style: ViewPropTypes.style,
	validateNewName: PropTypes.func,
	onSendGroupToCartPress: PropTypes.func.isRequired,
	onDeleteGroupPress: PropTypes.func.isRequired,
	onCollapse: PropTypes.func.isRequired,
};

ShoppingListHeaderName.defaultProps = {
	isEditing: false,
	isNew: false,
	name: '',
	onBlur: helpers.noop,
	onSaveName: helpers.noop,
	validateNewName: helpers.noop,
	isSectionEmpty: false,
};

export default ShoppingListHeaderName;
