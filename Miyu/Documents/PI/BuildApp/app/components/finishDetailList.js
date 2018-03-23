'use strict';

import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import { ListView } from 'BuildLibrary';
import FinishDetail from './finishDetail';
import helpers from '../lib/helpers';

class FinishDetailList extends Component {

	render() {
		const dataSource = new ListView.DataSource({
			rowHasChanged: () => true,
		}).cloneWithRows(this.props.finishes);
		return (
			<ListView
				dataSource={dataSource}
				enableEmptySections={true}
				renderRow={(finish) => {
					return (
						<FinishDetail
							{...finish}
							manufacturer={this.props.manufacturer}
							onPress={this.props.onFinishPress}
							isSelected={this.props.prevSelectedFinish.uniqueId === finish.uniqueId}
						/>
					);
				}}
			/>
		);
	}

}

FinishDetailList.propTypes = {
	finishes: PropTypes.array.isRequired,
	manufacturer: PropTypes.string.isRequired,
	onFinishPress: PropTypes.func.isRequired,
	prevSelectedFinish: PropTypes.object.isRequired,
};

FinishDetailList.defaultProps = {
	finishes: [],
	manufacturer: '',
	onFinishPress: helpers.noop,
};

export default FinishDetailList;
