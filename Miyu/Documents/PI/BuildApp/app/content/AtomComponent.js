import React, {
	Component,
} from 'react';
import PropTypes from 'prop-types';
import helpers from '../lib/helpers';
import AtomText from './Atoms/AtomText@1';
import AtomCloudinary from './Atoms/AtomCloudinary@1';
import HeroMedia from './Atoms/HeroMedia@1';
import AtomList from './Atoms/AtomList@1';
import EditorialBlob from './Atoms/EditorialBlob@1';
import ContentAuthor from './Atoms/ContentAuthor@1';
import SaleSection from './Atoms/SaleSection@1';
import NativeSaleSection from './Atoms/NativeSaleSection@1';
import AtomGroupItemPicker from './Atoms/AtomGroupItemPicker@1';
import AtomGroupItem from './Atoms/AtomGroupItem@1';
import AtomLinkPicker from './Atoms/AtomLinkPicker@1';
import EditorialSection from './Atoms/EditorialSection@1';
import AtomMultiselect from './Atoms/AtomMultiselect@1';
import NativePromo from './Atoms/NativePromo@1';
import AtomSection from './Atoms/AtomSection@1';
import SupportBlob from './Atoms/SupportBlob@1';
import AtomRichText from './Atoms/AtomRichText@1';

export default class AtomComponent extends Component {

	componentDidMount() {
		this.props.registerScrollTo(this.scrollTo);
	}

	scrollTo = (props) => {
		if (this.child && typeof this.child.scrollTo === 'function') {
			this.child.scrollTo(props);
		}
	};

	render() {
		const props = { ...this.props };
		delete props.registerScrollTo;

		if (props._type) {
			switch (props._type.split('.')[0]) {
				case 'atom-text@1':
					return <AtomText {...props} />;
				case 'atom-cloudinary@1':
					return <AtomCloudinary {...props} />;
				case 'hero-media@1':
					return <HeroMedia {...props} />;
				case 'atom-list@1':
					return <AtomList {...props} />;
				case 'editorial-blob@1':
					return <EditorialBlob {...props} />;
				case 'content-author@1':
					return <ContentAuthor {...props} />;
				case 'sale-section@1':
					return <SaleSection {...props} />;
				case 'native-sale-section@1':
					return (
						<NativeSaleSection
							ref={(ref) => this.child = ref}
							{...props}
						/>
					);
				case 'atom-group-item-picker@1':
					return <AtomGroupItemPicker {...props} />;
				case 'atom-section@1':
					return <AtomSection {...props} />;
				case 'support-blob@1':
					return <SupportBlob {...props} />;
				case 'atom-group-item@1':
					return <AtomGroupItem {...props} />;
				case 'atom-link-picker@1':
					return <AtomLinkPicker {...props} />;
				case 'atom-rich-text@1':
					return <AtomRichText {...props} />;
				case 'editorial-section@1':
					return <EditorialSection {...props} />;
				case 'atom-multiselect@1':
					return <AtomMultiselect {...props} />;
				case 'native-promo@1':
					return <NativePromo {...props} />;
				default:
					if (__DEV__) {
						return (
							<AtomText
								{...props}
								size="small"
								color="error"
								text={`Unknown atom type: ${props._type}`}
							/>
						);
					}
			}
		}
		return null;
	}

}

AtomComponent.propTypes = {
	_type: PropTypes.string.isRequired,
	registerScrollTo: PropTypes.func.isRequired,
	text: PropTypes.string,
};

AtomComponent.defaultProps = {
	_type: '',
	registerScrollTo: helpers.noop,
};
