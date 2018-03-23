import Joi from 'rn-joi';
import {
	CREDIT_CARD,
} from '../../constants/CheckoutConstants';


export default {
	checkoutCreditCard: Joi.object().keys({
		checkoutReducer: Joi.object().keys({
			billingAddressId: Joi.number().integer().required(),
			shippingAddressId: Joi.number().integer().required(),
			paymentType: Joi.string().valid(CREDIT_CARD).required(),
		}),
		userReducer: Joi.object().keys({
			user: Joi.object().keys({
				customerId: Joi.number().integer().required(),
			}),
		}),
		cartReducer: Joi.object().keys({
			cart: Joi.object().keys({
				shippingOptions: Joi.array().min(1).required(),
			}),
		}),
	}),
};
