import store from 'react-native-simple-store';

const SHOULD_NEW_CART_BOUNCE = 'SHOULD_NEW_CART_BOUNCE';
const BOUNCE_SHOPPING_LIST_ROW = 'BOUNCE_SHOPPING_LIST_ROW';
const PUSH_DEVICE_TOKEN = 'PUSH_DEVICE_TOKEN';
const ADD_TO_PROJECT_TUTORIAL = 'ADD_TO_PROJECT_TUTORIAL';

const SimpleStoreHelpers = {

	setBounceShoppingListRow(bounce) {
		return store.save(BOUNCE_SHOPPING_LIST_ROW, bounce);
	},

	shouldBounceShoppingListRow() {
		return store.get(BOUNCE_SHOPPING_LIST_ROW);
	},

	setShouldNewCartBounce(hasBounceBefore) {
		return store.save(SHOULD_NEW_CART_BOUNCE, hasBounceBefore);
	},

	shouldNewCartBounce() {
		return store.get(SHOULD_NEW_CART_BOUNCE);
	},

	storePushDeviceToken(token) {
		return store.save(PUSH_DEVICE_TOKEN, token);
	},

	getPushDeviceToken() {
		return store.get(PUSH_DEVICE_TOKEN);
	},

	setAddToProjectTutorial(tutorialSeen) {
		return store.save(ADD_TO_PROJECT_TUTORIAL, tutorialSeen);
	},

	hasSeenAddToProjectTutorial() {
		return store.get(ADD_TO_PROJECT_TUTORIAL);
	},

	clearAllData() {
		return store.keys().then((keys) => {
			keys.forEach((key) => {
				store.delete(key).done();
			});
		});
	},
};

export default SimpleStoreHelpers;
