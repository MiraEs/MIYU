import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import {
	FlatList,
	View,
} from 'react-native';
import ShoppingListItem from './ShoppingListItem';
import { processItemsForList } from '../../lib/ShoppingListHelper';
import helpers from '../../lib/helpers';


export default class ShoppingListSectionItem extends Component {

	getSubItemsData = () => {
		const { parentItem: { subItems } } = this.props;
		return processItemsForList(subItems);
	};

	renderSubItems = () => {
		const { onUpdateItem, parentItem, shoppingList } = this.props;
		if (parentItem.hasSubItems) {
			return (
				<FlatList
					data={this.getSubItemsData()}
					renderItem={({ item }) => {
						return (
							<ShoppingListItem
								item={item}
								isSubItem={true}
								onUpdateItem={onUpdateItem}
								projectId={shoppingList.projectId}
								sessionCartId={shoppingList.sessionCart.sessionCartId}
							/>
						);
					}}
					keyExtractor={(item, index) => `${item.itemKey}-${index}`}
				/>
			);
		}
	};

	render() {
		const { onUpdateItem, parentItem, shoppingList, bounceOnMount } = this.props;
		return (
			<View>
				<ShoppingListItem
					item={parentItem}
					onUpdateItem={onUpdateItem}
					projectId={shoppingList.projectId}
					sessionCartId={shoppingList.sessionCart.sessionCartId}
					bounceOnMount={bounceOnMount}
				/>
				{this.renderSubItems()}
			</View>
		);
	}
}

ShoppingListSectionItem.propTypes = {
	onUpdateItem: PropTypes.func,
	parentItem: PropTypes.object.isRequired,
	shoppingList: PropTypes.object.isRequired,
	bounceOnMount: PropTypes.bool,
};

ShoppingListSectionItem.defaultProps = {
	onUpdateItem: helpers.noop,
	bounceOnMount: false,
};
