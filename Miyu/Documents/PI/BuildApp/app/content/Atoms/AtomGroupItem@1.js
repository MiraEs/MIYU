import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'BuildLibrary';
import styles from '../../lib/styles';
import TrackingActions from '../../lib/analytics/TrackingActions';
import AtomComponent from '../AtomComponent';
import Icon from 'react-native-vector-icons/Ionicons';
import { IMAGE_42 } from '../../constants/CloudinaryConstants';
import { withNavigation } from '@expo/ex-navigation';
import { INCLUDE_TYPES } from '../../constants/ContentConstants';
import { connect } from 'react-redux';

const componentStyles = StyleSheet.create({
	arrow: {
		margin: styles.measurements.gridSpace1,
	},
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: styles.colors.white,
		padding: styles.measurements.gridSpace1,
		width: styles.dimensions.width,
	},
	image: {
		marginVertical: styles.measurements.gridSpace1 / 2,
		marginRight: styles.measurements.gridSpace2,
		...IMAGE_42,
	},
});

@withNavigation
export class AtomGroupItem extends Component {

	render() {
		const {
			categoryIncludes,
			facets,
			linkReferenceId: {
				categoryId,
				storeId,
			},
			linkType,
		} = this.props;
		const touchableProps = {
			onPress: null,
			trackAction: null,
			trackContextData: null,
		};
		if (linkType.toLowerCase() === INCLUDE_TYPES.CATEGORY) {
			const categoryInclude = categoryIncludes[storeId][categoryId];
			const link = parseInt(categoryInclude.link, 10);
			const props = {
				categoryId: link || categoryId,
			};
			if (facets && facets.selected && facets.selected.length) {
				props.selectedFacets = facets.selected.map(({ facetId, value }) => {
					return {
						facetId,
						value,
					};
				});
			}
			touchableProps.onPress = () => {
				this.props.navigator.push(linkType, props);
			};
			touchableProps.trackAction = TrackingActions.CATEGORY_LIST_TAP;
			touchableProps.trackContextData = {
				categoryName: categoryInclude.categoryName.replace(/\s/g, ''),
			};
		}
		return (
			<TouchableOpacity
				style={componentStyles.row}
				{...touchableProps}
			>
				<AtomComponent
					{...this.props.image}
					style={componentStyles.image}
				/>
				<AtomComponent
					style={styles.elements.flex1}
					{...this.props.title}
				/>
				<Icon
					name={'ios-arrow-forward'}
					size={25}
					color={styles.colors.greyDark}
					style={componentStyles.arrow}
				/>
			</TouchableOpacity>
		);
	}

}

AtomGroupItem.propTypes = {
	categoryIncludes: PropTypes.object,
	facets: PropTypes.object,
	linkReferenceId: PropTypes.object,
	linkType: PropTypes.string,
	title: PropTypes.object,
	image: PropTypes.object,
	navigator: PropTypes.object,
};

AtomGroupItem.defaultProps = {};

export default connect((state) => {
	return {
		categoryIncludes: state.contentReducer.categoryIncludes,
	};
}, null)(AtomGroupItem);
