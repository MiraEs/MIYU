'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	View,
	ViewPropTypes,
} from 'react-native';
import { ListView } from 'BuildLibrary';
import helpers from '../../../lib/helpers';
import {
	colors,
	dimensions,
	measurements,
} from '../../../lib/styles';

const componentStyles = StyleSheet.create({
	pageMarkers: {
		flex: 0,
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: measurements.gridSpace1,
		paddingTop: measurements.gridSpace1,
		alignItems: 'center',
	},
	pageMarker: {
		marginRight: measurements.gridSpace1,
		marginBottom: measurements.gridSpace1,
		backgroundColor: colors.grey,
		borderRadius: 5,
	},
});

export default class Pager extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pageIndex: 0,
			width: 0,
		};
	}

	getPagerMarkersStyle = () => {
		const childrenArr = React.Children.toArray(this.props.children);
		const thirtyStyle = childrenArr.length <= 30 ? { justifyContent: 'center' } : { marginBottom: measurements.gridSpace1 };
		return [componentStyles.pageMarkers, thirtyStyle, this.props.markerStyle];
	};

	onChangePage = (event) => {
		const pageIndex = helpers.toInteger(event.nativeEvent.contentOffset.x / this.pageWidth);
		if (pageIndex !== this.state.pageIndex) {
			// call with current index and previous index
			this.props.onPageChanged(pageIndex, this.state.pageIndex);
		}
		this.setState({
			pageIndex,
		});
	};

	renderPageMarker = () => {
		const childrenArr = React.Children.toArray(this.props.children);
		const size = childrenArr.length > 30 ? 5 : 10;
		const pagerMarkerSize = { height: size, width: size };
		if (childrenArr.length > 1 && this.props.markerEnabled) {
			const marker = childrenArr.map((child, index) => {
				return (
					<View
						key={index}
						style={[
							componentStyles.pageMarker,
							pagerMarkerSize,
							this.state.pageIndex === index ? { backgroundColor: colors.secondary } : {},
						]}
					/>
				);
			});
			return (
				<View style={this.getPagerMarkersStyle()}>
					{marker}
				</View>
			);
		}
	};

	renderPager = () => {
		const scenes = React.Children.map(this.props.children, (child) => {
			let wrap = child;
			if (typeof child !== View) {
				wrap = <View>{child}</View>;
			}
			return React.cloneElement(wrap, {
				onLayout: (event) => {
					if (!this.pageWidth) {
						this.pageWidth = event.nativeEvent.layout.width;
					}
				},
			});
		});
		const dataSource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
		}).cloneWithRows(scenes);
		return (
			<View style={this.props.style}>
				<ListView
					ref={(ref) => this.pager = ref}
					onLayout={(event) => {
						this.setState({
							width: event.nativeEvent.layout.width,
						});
					}}
					enableEmptySections={true}
					pagingEnabled={true}
					scrollEnabled={this.props.scrollEnabled}
					dataSource={dataSource}
					onMomentumScrollEnd={this.onChangePage}
					snapToInterval={1}
					renderRow={(Page) => Page}
					showsHorizontalScrollIndicator={false}
					horizontal={true}
					style={this.props.style}
					contentOffset={{ x: this.props.initialPage * (this.pageWidth || dimensions.width) }}
				/>
				{this.renderPageMarker()}
			</View>
		);
	};

	goToPage = (pageIndex) => {
		this.pager.scrollTo({ x: pageIndex * this.state.width });
		this.setState({
			pageIndex,
		});
	};

	goToPageWithoutAnimation = (pageIndex) => {
		this.pager.scrollTo({ x: pageIndex * this.state.width, animated: false });
		this.setState({
			pageIndex,
		});
	};

	render() {
		return this.renderPager();
	}

}

Pager.propTypes = {
	children: PropTypes.oneOfType([
		PropTypes.element,
		PropTypes.array,
	]),
	scrollEnabled: PropTypes.bool,
	markerStyle: ViewPropTypes.style,
	markerEnabled: PropTypes.bool,
	style: ViewPropTypes.style,
	onPageChanged: PropTypes.func.isRequired,
	initialPage: PropTypes.number,
};

Pager.defaultProps = {
	markerStyle: {},
	markerEnabled: true,
	style: {},
	onPageChanged: () => undefined,
	initialPage: 0,
};
