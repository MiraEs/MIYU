/*
 * some of our helper functions can't be loaded in a reducer
 * because they rely on the store to already be created
*/

import { Linking } from 'react-native';
import SafariView from 'react-native-safari-view';
import styles from './styles';
import Url from 'url';
import { trackAction } from '../actions/AnalyticsActions';
import TrackingActions from './analytics/TrackingActions';
import store from '../store/configStore';

const helpersWithLoadRequirements = {

	openURL(url, trackActionName) {
		if (!trackActionName) {
			trackActionName = TrackingActions.EXTERNAL_LINK;
		}
		if (url && typeof url === 'string') {
			url = encodeURI(url);
			const parsedUrl = Url.parse(url, true);
			parsedUrl.query.intcmp = 'buildapp';

			url = Url.format(parsedUrl);

			store.dispatch(trackAction(trackActionName, {
				url,
			}));

			SafariView.isAvailable()
				.then(() => {
					SafariView.show({
						url,
						tintColor: styles.colors.primary,
					});
				}, () => {
					Linking.openURL(url);
				});
		} else {
			store.dispatch(trackAction(TrackingActions.INVALID_LINK, {
				url,
			}));

			// need logging here for now neato
			console.error('bad url', url);
		}
	},
};

module.exports = helpersWithLoadRequirements;
