
import { handleActions } from 'redux-actions';
import productsActions, {
	SET_AVAILABILITY,
	AVAILABILITY,
	GET_AVAILABILITY,
	GET_AVAILABILITY_SUCCESS,
	GET_AVAILABILITY_FAIL,
} from '../actions/ProductsActions';
import helpers from '../lib/helpers';

const {
	getProductCompositeSuccess,
	getProductAttachmentsSuccess,
	getProductCompositeDescriptionSuccess,
	getProductCompositeDescriptionError,
	availabilityAction,
	clearProductCache,
} = productsActions;

const initialState = {};

const decorateProductComposite = (productComposite) => {
	let finishes = productComposite.finishes.filter((finish) => finish.status && finish.status.toLowerCase() === 'stock');
	if (!finishes.length) {
		finishes = productComposite.finishes;
	}
	const productSpecs = productComposite.productSpecs;
	const topProductSpecs = productSpecs.filter((spec) => spec.showInList).slice(0, 5);
	let squareFootagePerCarton;
	if (productComposite.squareFootageBased) {
		const squareFootSpec = productComposite.productSpecs.find((spec) => spec.attributeName.toLowerCase() === 'square foot per carton');
		squareFootSpec.productSpecValue.forEach((item) => squareFootagePerCarton = helpers.toFloat(item.value));
	}

	return {
		accessories: productComposite.accessories,
		application: productComposite.application,
		attachmentCount: productComposite.attachmentCount,
		availability: { status: AVAILABILITY.UNKNOWN },
		compositeId: productComposite.productCompositeId,
		productCompositeId: productComposite.productCompositeId,
		discontinued: productComposite.discontinued,
		series: productComposite.series,
		manufacturer: productComposite.manufacturer,
		manufacturerInfo: productComposite.manufacturerInfo,
		productVideos: productComposite.productVideos,
		title: productComposite.title,
		type: productComposite.type,
		description: productComposite.description.replace(/[\n\r]+/g, '').replace(/[\t]+/g, ' '),
		productId: productComposite.productId,
		imageGallery: productComposite.imageGallery,
		squareFootageBased: productComposite.squareFootageBased,
		availableByLocation: productComposite.availableByLocation,
		productQuestions: productComposite.productQuestions.map((question) => {
			return {
				...question,
				body: helpers.removeHTML(question.body),
			};
		}),
		reviewRating: productComposite.reviewRating,
		pricedOptionGroups: productComposite.pricedOptionGroups,
		recommendedOptions: productComposite.recommendedOptions,
		rootCategory: productComposite.rootCategory,
		variations: productComposite.variations,
		squareFootagePerCarton,
		productSpecs,
		topProductSpecs,
		finishes,
	};
};

export default handleActions({

	[getProductCompositeSuccess]: (state, action) => {
		return {
			...state,
			[action.payload.productCompositeId]: decorateProductComposite(action.payload, state[action.payload.productCompositeId]),
		};
	},

	[getProductAttachmentsSuccess]: (state, action) => {
		const {
			compositeId,
		} = action.payload;
		const { manufacturer } = state[compositeId];
		const attachments = action.payload.attachments.map((attachment) => {
			return {
				...attachment,
				// @offload
				url: `https://s2.img-b.com/build.com/mediabase/specifications/${manufacturer.toLowerCase().replace(/\s/g, '_')}/${compositeId}/${attachment.filename.toLowerCase()}`,
			};
		});
		return {
			...state,
			[compositeId]: {
				...state[compositeId],
				attachments,
			},
		};
	},

	[getProductCompositeDescriptionSuccess]: (state, action) => {
		const {
			compositeId,
			title,
			blocks,
		} = action.payload;
		return {
			...state,
			[compositeId]: {
				...(state[compositeId] || {}),
				compositeDescriptionError: null,
				compositeDescription: {
					title,
					blocks,
				},
			},
		};
	},

	[getProductCompositeDescriptionError]: (state, action) => {
		const { compositeId } = action.payload;
		return {
			...state,
			[compositeId]: {
				...(state[compositeId] || {}),
				compositeDescription: {},
				compositeDescriptionError: 'We were unable to get the product description for this product.',
			},
		};
	},

	[availabilityAction]: (state, action) => {
		const { availability, compositeId, error, event } = action.payload;
		switch (event) {
			case GET_AVAILABILITY: {
				return {
					...state,
					[compositeId]: {
						...state[compositeId],
						fetchingAvailability: true,
					},
					error: '',
				};
			}
			case GET_AVAILABILITY_SUCCESS: {
				return {
					...state,
					[compositeId]: {
						...state[compositeId],
						fetchingAvailability: false,
						availability,
					},
					error: '',
				};
			}
			case GET_AVAILABILITY_FAIL: {
				return {
					...state,
					[compositeId]: {
						...state[compositeId],
						fetchingAvailability: false,
					},
					error,
				};
			}
			case SET_AVAILABILITY: {
				return {
					...state,
					[compositeId]: {
						...state[compositeId],
						availability,
					},
				};
			}
			default:
				return state;
		}
	},

	[clearProductCache]: () => initialState,

}, initialState);
