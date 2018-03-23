function makeAction(action) {
	return `build:app:${action}`;
}

const TrackingActions = {
	// CartRow
	CART_ROW_UNDO: makeAction('cartrow:undo'),

	SAVE_CART: makeAction('cart:savecart'),

	// Cart
	CART_ADD_COUPON_CODE: makeAction('cart:addcouponcode'),
	CART_EDIT_COUPON_CODE: makeAction('cart:editcouponcode'),
	CART_REMOVE_COUPON_CODE: makeAction('cart:removecouponcode'),
	CART_SHIPPING_ESTIMATE: makeAction('cart:shippingestimate'),
	CART_MESSAGE: makeAction('cart:message'),
	CART_SELECT_CHECKOUT: makeAction('cart:selectCheckout'),
	CART_CHECKOUT_CREDITCARD: makeAction('cart:checkoutCreditCard'),
	CART_CHECKOUT_PAYPAL: makeAction('cart:checkoutPayPal'),
	CART_CHECKOUT_APPLEPAY: makeAction('cart:checkoutApplePay'),
	CART_ITEM_REMOVE: makeAction('cart:removeitem'),
	CART_ITEM_ADD: makeAction('cart:additem'),
	CART_NAV_TAP_CLOSE: makeAction('cart:navtapclose'),
	CART_NAV_TAP_MORE: makeAction('cart:navtapmore'),
	CART_ADD_ITEM_TO_PROJECT: makeAction('cart:additemtoproject'),
	CART_ADD_CART_TO_PROJECT: makeAction('cart:addcarttoproject'),

	// EmailCartModal
	EMAIL_CART: makeAction('emailcartmodal:email'),

	// Favorites
	FAVORITE_ADD_TO_CART: makeAction('favorites:additem'),
	FAVORITE_CREATE_LIST: makeAction('favorites:createlist'),
	FAVORITE_EDIT_LIST: makeAction('favorites:editlist'),
	FAVORITE_EMPTY_START_FAVORITING: makeAction('favorites:emptyFavoritesStartFavoriting'),
	FAVORITE_LIST_ADD_TO_CART: makeAction('favorites:addtocart'),
	FAVORITE_CHANGE_FINISH: makeAction('favorites:changefinish'),
	FAVORITE_ADD: makeAction('favorite:add'),
	FAVORITES_NAV_TAP_NEW_FAVORITE_LIST: makeAction('favorites:navtapnewfavoritelist'),
	FAVORITES_NAV_TAP_MORE: makeAction('favorites:navtapmore'),

	// Favorites swipe actions
	FAVORITE_SWIPE_CHANGE_FINISH: makeAction('favorite:swipe:changefinish'),
	FAVORITE_SWIPE_MOVE_OR_COPY: makeAction('favorite:swipe:movecopy'),
	FAVORITE_SWIPE_REMOVE: makeAction('favorite:swipe:remove'),

	// LoadCartModal
	LOAD_CART: makeAction('loadcartmodal:loadcart'),
	LOAD_QUOTE: makeAction('loadcartmodal:loadquote'),
	LOAD_LOGIN: makeAction('loadcartmodal:loadlogin'),

	// CheckoutLoginModal
	CHECKOUT_LOGIN: makeAction('checkoutloginmodal:login'),
	CHECKOUT_SIGNUP: makeAction('checkoutloginmodal:signup'),
	CHECKOUT_GUESTCHECKOUT: makeAction('checkoutloginmodal:guestcheckout'),

	// CheckoutScreen
	CHECKOUT_SUBMIT: makeAction('checkout:submit'),
	CHECKOUT_ADD_COUPON_CODE: makeAction('checkout:addcouponcode'),
	CHECKOUT_EDIT_COUPON_CODE: makeAction('checkout:editcouponcode'),
	CHECKOUT_REMOVE_COUPON_CODE: makeAction('checkout:removecouponcode'),
	CHECKOUT_PURCHASE: makeAction('checkout:purchase'),
	CHECKOUT_NAV_TAP_CLOSE: makeAction('checkout:navtapclose'),

	CHECKOUT_CONFIRMATION_CREATE_ACCOUNT: makeAction('checkoutconfirmation:createaccount'),
	CHECKOUT_CONFIRMATION_ENABLE_NOTIFICATIONS: makeAction('checkoutconfirmation:enablenotifications'),
	CHECKOUT_CONFIRMATION_ADD_TO_PROJECT: makeAction('checkoutconfirmation:addtoproject'),
	CHECKOUT_CONFIRMATION_CONTINUE_SHOPPING: makeAction('checkoutconfirmation:continueshopping'),
	CHECKOUT_CONFIRMATION_CLOSE_SUCCESS: makeAction('checkoutconfirmation:closesuccess'),
	CHECKOUT_CONFIRMATION_CLOSE_FAIL: makeAction('checkoutconfirmation:closefail'),
	CHECKOUT_CONFIRMATION_NAV_TAP_CLOSE: makeAction('checkoutconfirmation:navtapclose'),

	// ChooseCreateOrLinkSocialAccountScreen
	CREATE_SOCIAL_ACCOUNT: makeAction('createOrLinkSocialAccount:create'),
	LINK_SOCIAL_ACCOUNT: makeAction('createOrLinkSocialAccount:link'),

	// ContactInfo
	CONTACT_INFO_SUBMIT: makeAction('contactinfo:submit'),

	//createEditProject
	CREATE_PROJECT: makeAction('newproject:create'),
	EDIT_PROJECT: makeAction('editproject:save'),

	// projectsScreen
	PROJECTS_NAV_TAP_ADD_PROJECT: makeAction('projects:navtapaddproject'),
	PROJECTS_SETTINGS: makeAction('projects:settings'),
	PROJECT_DETAILS_SETTINGS: makeAction('project:details:settings'),
	PROJECT_DETAILS_EDIT_SETTINGS: makeAction('project:details:editsettings'),
	PROJECT_DETAILS_EDIT_SAVE: makeAction('project:details:editsave'),
	PROJECT_ARCHIVE: makeAction('project:archive'),

	// projects details -> team tab
	TEAM_INVITE_TEAMMATES_TAP: makeAction('projects:details:team:inviteteammatestap'),
	TEAM_RESEND_INVITES: makeAction('projects:details:team:resend'),
	TEAM_MEMBER_TAP: makeAction('projects:details:team:membertap'),

	// Projects Details -> shopping list tab
	SHOPPING_LIST_ADD_GROUP: makeAction('projects:details:shoppinglist:addgroup'),
	SHOPPING_LIST_ADD_ALL_TO_CART_TAP: makeAction('projects:details:shoppinglist:addalltocarttap'),
	SHOPPING_LIST_ADD_TO_PROJECT: makeAction('projects:details:shoppinglist:addtoproject'),
	SHOPPING_LIST_SHARE: makeAction('projects:details:shoppinglist:share'),
	SHOPPING_LIST_ITEM_ADD_TO_CART_TAP: makeAction('projects:details:shoppinglist:additemtocarttap'),
	SHOPPING_LIST_ITEM_EDIT_TAP: makeAction('projects:details:shoppinglist:edititemtap'),
	SHOPPING_LIST_ITEM_DELETE_TAP: makeAction('projects:details:shoppinglist:deleteitemtap'),
	SHOPPING_LIST_ITEM_SWIPE: makeAction('projects:details:shoppinglist:itemswipe'),
	SHOPPING_LIST_UPDATE_LIST_NAME: makeAction('projects:details:shoppinglist:updatelistname'),
	SHOPPING_LIST_CATEGORY_TAP: makeAction('projects:details:shoppinglist:categorytap'),
	SHOPPING_LIST_VIEW_ORDERS: makeAction('projects:details:shoppinglist:vieworders'),
	SHOPPING_LIST_VIEW_ALL_ORDERS_TAP: makeAction('projects:details:shoppinglist:viewallorderstap'),
	SHOPPING_LIST_ADD_GROUP_TO_CART_TAP: makeAction('projects:details:shoppinglist:addgrouptocarttap'),
	SHOPPING_LIST_DELETE_GROUP_TAP: makeAction('projects:details:shoppinglist:deletegrouptap'),

	// edit item screen from an item in a shopping list
	EDIT_ITEM_NAV_TO_PRODUCT: makeAction('projects:details:shoppinglist:edititem:navigatetoproduct'),
	EDIT_ITEM_COPY_TO_PROJECT: makeAction('projects:details:shoppinglist:edititem:copytoproject'),

	// Project Details -> photos tab
	PHOTOS_UPLOAD_PHOTO_TAP: makeAction('projects:details:photos:uploadphoto'),
	PHOTOS_PHOTO_TAP: makeAction('projects:details:photos:phototap'),

	//CreditCardScreen
	CREDIT_CARD_USE_CARD: makeAction('creditcard:usecard'),

	// Empty Cart
	EMPTY_CART_LOAD: makeAction('emptycart:loadcart'),

	// EventsScreen
	EVENTS_ADD_ORDERS_TO_PROJECT: makeAction('events:addorders'),
	EVENTS_ADD_FAVORITES_TO_PROJECT: makeAction('events:addfavorites'),
	EVENTS_ADD_PHOTOS: makeAction('events:addphotos'),
	EVENTS_START_SHOPPING: makeAction('events:startshopping'),
	EVENTS_CREATE_FAVORITES_LIST: makeAction('events:createfavoriteslist'),
	EVENTS_NAV_TAP_ICON_PERSON_ADD: makeAction('events:navtapaddperson'),
	EVENTS_NAV_TAP_ICON_PROJECT_SETTINGS: makeAction('events:navtapprojectsettings'),

	//email us
	EMAIL_US_SUBMIT: makeAction('emailus:submit'),

	// forgotPassword
	RESET_PASSWORD: makeAction('forgotpassword:reset'),

	//InviteScreen
	SEND_INVITE: makeAction('invite:send'),

	// LinkAccountScreen
	LINK_ACCOUNT_LINK: makeAction('linkaccount:link'),

	// LoginModal
	LOGIN_MODAL_FACEBOOK: makeAction('loginmodal:facebook'),
	LOGIN_MODAL_RESET_PASSWORD: makeAction('loginmodal:resetpassword'),
	LOGIN_MODAL_LOGIN: makeAction('loginmodal:login'),
	LOGIN_MODAL_CREATE_ACCOUNT: makeAction('loginmodal:createaccount'),

	// Signup screen
	SIGN_UP_CONTINUE_WITH_FACEBOOK: makeAction('signup:continuewithfacebook'),
	SIGN_UP_CREATE_ACCOUNT: makeAction('signup:createaccount'),
	PRO_REGISTRATION_SUBMIT: makeAction('proregistration:submit'),
	PRO_REGISTRATION_START: makeAction('proregistration:start'),
	PRO_REGISTRATION_DONE: makeAction('proregistration:done'),
	PRO_REGISTRATION_CLOSE: makeAction('proregistration:close'),

	// MoreScreen
	MORE_LOGIN: makeAction('more:login'),
	MORE_SIGN_UP: makeAction('more:signup'),
	MORE_LOG_OUT: makeAction('more:logout'),

	// NewAddress
	NEW_ADDRESS_SUBMIT: makeAction('newaddress:submit'),

	// Notifications
	NOTIFICATIONS_ENABLE_NOTIFICATIONS: makeAction('notifications:enablenotifications'),
	NOTIFICATIONS_GET_STARTED: makeAction('notifications:getStarted'),

	// Push Notifications Settings Screen
	ENABLE_PUSH_NOTIFICATIONS_TAP: makeAction('pushnotifications:enablenotificationstap'),

	// OrderDetailsScreen
	ORDER_DETAILS_TRACK_ORDER: makeAction('orderdetails:trackorder'),
	ORDER_DETAILS_VIEW_INVOICE: makeAction('orderdetails:viewinvoice'),
	ORDER_DETAILS_ADD_TO_PROJECT: makeAction('orderdetails:addtoproject'),

	// PaymentScreen
	PAYMENT_ADD_NEW_CARD: makeAction('payment:addnewcard'),
	PAYMENT_PAYPAL: makeAction('payment:paypal'),

	// PDP
	PRODUCT_VIEWED: makeAction('product:viewed'),
	PRODUCT_3D_MODEL: makeAction('product:3dmodelviewed'),
	PRODUCT_AR_LAUNCH: makeAction('product:arlaunched'),
	PDP_ADDITEM: makeAction('pdp:additem'),
	PDP_SHOP_COLLECTION: makeAction('pdp:shopcollection'),
	PDP_SHARE_PRODUCT: makeAction('pdp:shareproduct'),
	PDP_NEW_CART: makeAction('pdp:newcart'),
	PDP_CALL_TO_ORDER_ITEM: makeAction('pdp:calltoorder'),
	PDP_NAV_TAP_SHARE: makeAction('pdp:navtapshare'),
	PDP_ADD_TO_PROJECT: makeAction('pdp:addtoproject'),
	PRODUCT_DESCRIPTION_READ_MORE: makeAction('pdp:productdescriptionreadmore'),
	PRODUCT_DESCRIPTION_COLLECTION: makeAction('pdp:productdescriptioncollection'),

	PDP_VARIATION: makeAction('pdp:variation'),
	VARIATION_CONTINUE: makeAction('pdp:variationcontinue'),
	PRICED_OPTION_GROUP_HELP: makeAction('pdp:pricedoptiongrouphelp'),

	// ProductCustomizationScreen
	PRODUCT_CUSTOMIZATION_DONE: makeAction('productcustomization:done'),
	PRODUCT_CUSTOMIZATION_NAV_TAP_INFO: makeAction('productcustomization:navtapinfo'),

	// ProductRestrictions
	PRODUCT_RESTRICTIONS_SHOP_SIMILAR: makeAction('productrestrictions:shopsimilar'),

	// ProductUpsell
	PRODUCT_UPSELL_CONTINUE_TO_CART: makeAction('productupsell:continuetocart'),
	PRODUCT_UPSELL_NAV_TAP_CLOSE: makeAction('productupsell:navtapclose'),

	// Project Upsell - when adding items to a project and you show rec/req Products
	PROJECT_UPSELL_CONTINUE: makeAction('projectupsell:continue'),
	PROJECT_UPSELL_NAV_TAP_CLOSE: makeAction('projectupsell:navtapclose'),


	// ProductReviewScreen
	PRODUCT_REVIEW_REFRESH: makeAction('productreview:refresh'),

	// RelatedProduct
	RELATED_PRODUCT_REQUIRED_ADD_TO_CART: makeAction('relatedproduct:requiredadditem'),
	RELATED_PRODUCT_RECOMMENDED_ADD_TO_CART: makeAction('relatedproduct:recommendedadditem'),
	RELATED_PRODUCT_MAY_WE_SUGGEST_ADD_TO_CART: makeAction('relatedproduct:maywesuggestadditem'),
	RELATED_PRODUCT_CHOOSE_MODEL: makeAction('relatedproduct:choosemodel'),
	RELATED_PRODUCT_REQUIRED_ADD_TO_PROJECT: makeAction('relatedproduct:requiredadditem'),
	RELATED_PRODUCT_RECOMMENDED_ADD_TO_PROJECT: makeAction('relatedproduct:recommendedadditem'),
	RELATED_PRODUCT_MAY_WE_SUGGEST_ADD_TO_PROJECT: makeAction('relatedproduct:maywesuggestadditem'),

	// AddressScreen
	ADDRESS_NEW_ADDRESS: makeAction('address:newaddress'),

	// Account detail screen
	EDIT_ADDRESS: makeAction('accountdetails:editaddress'),
	DELETE_ADDRESS: makeAction('accountdetails:deleteaddress'),
	CREATE_ADDRESS: makeAction('accountdetails:createaddress'),
	EDIT_CREDIT_CARD: makeAction('accountdetails:editcreditcard'),
	DELETE_CREDIT_CARD: makeAction('accountdetails:deletecreditcard'),
	CREATE_CREDIT_CARD: makeAction('accountdetails:createcreditcard'),
	ACCOUNT_DETAILS_CHANGE_PASSWORD: makeAction('changepassword:changepassword'),
	UPDATE_ACCOUNT_DETAILS: makeAction('accountdetails:update'),

	// experts screen
	EXPERTS_SCREEN_CALL: makeAction('experts:call'),
	EXPERTS_SCREEN_EMAIL: makeAction('experts:email'),
	EXPERTS_CONTACT_US: makeAction('experts:contactus'),

	// FAQ
	FAQ_CONTACT_US_EMAIL: makeAction('faq:contactusemail'),
	FAQ_CONTACT_US_PHONE: makeAction('faq:contactusphone'),

	//shippingmodal
	BACK_TO_CART: makeAction('shippingmodal:backtocart'),

	// HalfPageListSelector
	DONE_BUTTON: makeAction('halfpage:done'),

	//OrderTackingScreen
	BACK_TO_ORDER_DETAILS: makeAction('ordertracking:goback'),

	// Onboarding
	ONBOARDING_LOGIN: makeAction('onboarding:login'),
	ONBOARDING_SIGNUP: makeAction('onboarding:signup'),
	ONBOARDING_CONTINUE_AS_GUEST: makeAction('onboarding:continueasguest'),
	ONBOARDING_NOTIFICATIONS_OPT_IN: makeAction('onboarding:notificationsoptin'),
	ONBOARDING_NOTIFICATIONS_OPT_OUT: makeAction('onboarding:notificationsoptout'),
	ONBOARDING_SKIP_INTRO: makeAction('onboarding:skipintro'),
	ONBOARDING_SKIP_TUTORIAL: makeAction('onboarding:skiptutorial'),
	ONBOARDING_TOUR_THE_APP: makeAction('onboarding:tourtheapp'),
	ONBOARDING_START_SHOPPING: makeAction('onboarding:startshopping'),
	NOTIFICATIONS_SOFT_ASK_OPT_IN: makeAction('notifications:softaskoptin'),
	NOTIFICATIONS_SOFT_ASK_NO_THANKS: makeAction('notifications:softasknothanks'),

	// Quotes
	QUOTE_LOAD_CART: makeAction('quotescreen:loadcart'),
	QUOTE_CALL_TO_ORDER: makeAction('quotescreen:calltoorder'),
	QUOTE_NAV_TAP_CLOSE: makeAction('quotescreen:navtapclose'),

	// Other actions
	CUSTOMER_SIGNUP_COMPLETE: makeAction('signup:complete'),
	CUSTOMER_SIGNIN_COMPLETE: makeAction('signin:complete'),
	CUSTOMER_SIGNOUT_COMPLETE: makeAction('signout:complete'),
	PRODUCT_SHARED_COMPLETE: makeAction('product:shared'),
	PHONE_DIAL: makeAction('phonedial'),
	CUSTOMER_IMPERSONATOR_LOGOUT: makeAction('customerimpersonator:logout'),
	CUSTOMER_IMPERSONATOR_LOGIN: makeAction('customerimpersonator:login'),

	//Lookback.io
	LOOKBACK_START: makeAction('lookback:start'),
	LOOKBACK_STOP: makeAction('lookback:stop'),

	// DeepLinking
	DEEPLINKING_ROUTE_MATCH_ERROR: makeAction('deeplinking:routematcherror'),
	DEEPLINKING_ROUTE_FROM_URI: makeAction('deeplinking:routefromuri'),
	DEEPLINKING_SMART_APP_BANNER: makeAction('smartappbanner'),

	// Recently Viewed Screen
	RECENTLY_VIEWED_DEALS: makeAction('recentlyviewed:deals'),

	// CTAs
	SHARED_PROMO_CTA: makeAction('sharedpromo:cta'),
	NATIVE_HOME_CTA: makeAction('nativehome:cta'),
	RECENTLY_VIEWED_CTA: makeAction('recentlyviewed:cta'),

	// Profile Screen
	PROFILE_CALL: makeAction('profile:call'),
	PROFILE_EMAIL: makeAction('profile:email'),

	// Categories
	CATEGORY_LIST_TAP: makeAction('categorylist:categorytap'),
	PAGER_TAB_TAP: makeAction('pager:tabtap'),

	// Content
	CONTENT_ERROR_RETRY: makeAction('content:errorretry'),

	// GE checkout
	CALENDAR_PICKER_CLOSE: makeAction('caledarpicker:close'),
	CALENDAR_PICKER_REQUEST_DELIVERY_DATE: makeAction('calendarpicker:requestdeliverydate'),
	CART_DELIVERY_SUMMARY_SELECT_DATE: makeAction('cartdeliverysummary:requestdeliverydate'),
	CC_CHECKOUT_REQUEST_DELIVERY_DATE: makeAction('checkoutcreditcard:requestdeliverydate'),
	PP_CHECKOUT_REQUEST_DELIVERY_DATE: makeAction('checkoutpaypal:requestdeliverydate'),

	// External links
	REBATE_LINK: makeAction('link:rebate'),
	EXTERNAL_LINK: makeAction('link:external'),
	INVALID_LINK: makeAction('link:invalid'),

	// Facebook Analytics Events
	FB_FIRST_LAUNCH: 'First Launch',
	FB_CHECKOUT_COMPLETE: 'Checkout Complete',
	FB_FAVORITE_ITEM: 'Favorite Item',
	FB_CALL_EXPERT: 'Call Expert',

	// Articles
	ARTICLE_PREVIEW_TAP: makeAction('articlestab:articlepreviewtap'),
	EDITORIAL_SECTION_CTA: makeAction('article:editorialsectioncta'),
	ARTICLE_RELATED_PRODUCT_TAP: makeAction('article:relatedproducttap'),
	ARTICLE_RELATED_VIDEO_TAP: makeAction('article:relatedvideotap'),
	ARTICLE_AUTHOR_TAP: makeAction('article:authortap'),
	ARTICLE_SHARE_TAP: makeAction('article:articlesharetap'),

	// Native Promos
	NATIVE_PROMO_COUPON_TAP: makeAction('nativepromo:coupontap'),
	NATIVE_PROMO_IMAGE_TAP: makeAction('nativepromo:imagetap'),
	NATIVE_PROMO_CTA_TAP: makeAction('nativepromo:ctatap'),

	// Add To Project Modal
	ADD_TO_PROJECT_CREATE_PROJECT_TAP: makeAction('addtoproject:createprojecttap'),
	ADD_TO_PROJECT_CREATE_GROUP_TAP: makeAction('addtoproject:creategrouptap'),

	// Invite Teammates
	INVITE_TEAMMATES_SEND_INVITATION: makeAction('inviteteammates:sendinvitation'),
	INVITE_TEAMMATES_INVITE_FROM_CONTACT_TAP: makeAction('inviteteammates:invitefromcontactstap'),

	// ListOverview
	LIST_OVERVIEW_FAVORITES_VIEW_ALL_TAP: makeAction('lists:favorites:viewalltap'),
	LIST_OVERVIEW_PROJECTS_VIEW_ALL_TAP: makeAction('lists:projects:viewalltap'),
	LIST_OVERVIEW_FAVORITE_ROW_TAP: makeAction('lists:favorites:rowtap'),
	PROJECT_ROW_TAP: makeAction('projectrowtap'),

	// AlertBar
	ALERT_BAR_LINK_BUTTON: makeAction('alertbar:linktap'),

	// Modal
	MODAL_CANCEL: makeAction('modal:cancel'),
	MODAL_DONE: makeAction('modal:done'),
};

module.exports = TrackingActions;
