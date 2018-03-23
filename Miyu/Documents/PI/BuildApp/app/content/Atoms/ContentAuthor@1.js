import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import {
	Image,
	Text,
	TouchableOpacity,
} from 'BuildLibrary';
import styles from '../../lib/styles';
import { connect } from 'react-redux';
import AtomComponent from '../AtomComponent';
import { withNavigation } from '@expo/ex-navigation';
import TrackingActions from '../../lib/analytics/TrackingActions';

const profileImageSize = 60;

const componentStyles = StyleSheet.create({
	authorWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

@withNavigation
export class ContentAuthor extends Component {

	constructor(props) {
		super(props);
		if (props.profile_id) {
			this.profile = props.profileIncludes[props.profile_id.selected[0]];
			this.imageUri = `https://s3.img-b.com/image/upload/w_${profileImageSize},h_${profileImageSize},c_fill,dpr_2.0,g_face,r_max/v1/mediabase/build_profiles/${this.profile.employeeId}/profile/${this.profile.employeeId}.png`;
		}
	}

	render() {
		if (this.props.profile_id) {
			return (
				<TouchableOpacity
					trackAction={TrackingActions.ARTICLE_AUTHOR_TAP}
					style={[componentStyles.authorWrapper, this.props.style]}
					onPress={() => {
						this.props.navigator.push('profile', { profile: this.profile });
					}}
				>
					<Image
						source={this.imageUri}
						width={profileImageSize}
						height={profileImageSize}
					/>
					<View style={styles.elements.padding1}>
						<Text
							color="white"
							weight="bold"
							family="archer"
						>
							{this.profile.fullName}</Text>
						<Text
							color="white"
						>{this.profile.title}</Text>
					</View>
				</TouchableOpacity>
			);
		} else if (this.props.guest_author) {
			return (
				<AtomComponent
					{...this.props.guest_author.full_name}
					color="white"
					style={this.props.style}
					size="small"
				/>
			);
		}
		return null;
	}

}

ContentAuthor.propTypes = {
	navigator: PropTypes.object,
	profileIncludes: PropTypes.object,
	profile_id: PropTypes.object,
	guest_author: PropTypes.object,
	style: ViewPropTypes.style,
};

export default connect((state) => ({ profileIncludes: state.contentReducer.profileIncludes }), null)(ContentAuthor);
