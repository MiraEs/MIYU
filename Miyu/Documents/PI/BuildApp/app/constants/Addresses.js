'use strict';

export const US = 'US';
export const CANADA = 'CA';

export const SHIPPING_ADDRESS = 'SHIPPING';
export const BILLING_ADDRESS = 'BILLING';

export const COUNTRIES = [{
	text: 'United States',
	value: US,
}, {
	text: 'Canada',
	value: CANADA,
}];

export const STATES = [
	{text: 'Alabama', value: 'AL', country: US},
	{text: 'Alaska', value: 'AK', country: US},
	{text: 'American Samoa', value: 'AS', country: US},
	{text: 'Arizona', value: 'AZ', country: US},
	{text: 'Arkansas', value: 'AR', country: US},
	{text: 'California', value: 'CA', country: US},
	{text: 'Colorado', value: 'CO', country: US},
	{text: 'Connecticut', value: 'CT', country: US},
	{text: 'Delaware', value: 'DE', country: US},
	{text: 'District of Columbia', value: 'DC', country: US},
	{text: 'Federated States of Micronesia', value: 'FM', country: US},
	{text: 'Florida', value: 'FL', country: US},
	{text: 'Georgia', value: 'GA', country: US},
	{text: 'Guam', value: 'GU', country: US},
	{text: 'Hawaii', value: 'HI', country: US},
	{text: 'Idaho', value: 'ID', country: US},
	{text: 'Illinois', value: 'IL', country: US},
	{text: 'Indiana', value: 'IN', country: US},
	{text: 'Iowa', value: 'IA', country: US},
	{text: 'Kansas', value: 'KS', country: US},
	{text: 'Kentucky', value: 'KY', country: US},
	{text: 'Lousiana', value: 'LA', country: US},
	{text: 'Maine', value: 'ME', country: US},
	{text: 'Marshall Islands', value: 'MH', country: US},
	{text: 'Maryland', value: 'MD', country: US},
	{text: 'Massachusetts', value: 'MA', country: US},
	{text: 'Michigan', value: 'MI', country: US},
	{text: 'Minnesota', value: 'MN', country: US},
	{text: 'Mississippi', value: 'MS', country: US},
	{text: 'Missouri', value: 'MO', country: US},
	{text: 'Montana', value: 'MT', country: US},
	{text: 'Nebraska', value: 'NE', country: US},
	{text: 'Nevada', value: 'NV', country: US},
	{text: 'New Hampshire', value: 'NH', country: US},
	{text: 'New Jersey', value: 'NJ', country: US},
	{text: 'New Mexico', value: 'NM', country: US},
	{text: 'New York', value: 'NY', country: US},
	{text: 'North Carolina', value: 'NC', country: US},
	{text: 'North Dakota', value: 'ND', country: US},
	{text: 'Northern Mariana Islands', value: 'MP', country: US},
	{text: 'Ohio', value: 'OH', country: US},
	{text: 'Oklahoma', value: 'OK', country: US},
	{text: 'Oregon', value: 'OR', country: US},
	{text: 'Palau', value: 'PW', country: US},
	{text: 'Pennsylvania', value: 'PA', country: US},
	{text: 'Puerto Rico', value: 'PR', country: US},
	{text: 'Rhode Island', value: 'RI', country: US},
	{text: 'South Carolina', value: 'SC', country: US},
	{text: 'South Dakota', value: 'SD', country: US},
	{text: 'Tennessee', value: 'TN', country: US},
	{text: 'Texas', value: 'TX', country: US},
	{text: 'Utah', value: 'UT', country: US},
	{text: 'Vermont', value: 'VT', country: US},
	{text: 'Virgin Islands', value: 'VI', country: US},
	{text: 'Virginia', value: 'VA', country: US},
	{text: 'Washington', value: 'WA', country: US},
	{text: 'West Virginia', value: 'WV', country: US},
	{text: 'Wisconsin', value: 'WI', country: US},
	{text: 'Wyoming', value: 'WY', country: US},
	{text: 'Armed Forces Europe, the Middle East, and Canada', value: 'AE', country: US},
	{text: 'Armed Forces Canada', value: 'AE', country: US},
	{text: 'Armed Forces the Middle East', value: 'AE', country: US},
	{text: 'Armed Forces Europe', value: 'AE', country: US},
	{text: 'Armed Forces Pacific', value: 'AP', country: US},
	{text: 'Armed Forces Americas (Except Canada)', value: 'AA', country: US},
	{text: 'Armed Forces Americas', value: 'AA', country: US},
	{text: 'Alberta', value: 'AB', country: CANADA},
	{text: 'British Columbia', value: 'BC', country: CANADA},
	{text: 'Manitoba', value: 'MB', country: CANADA},
	{text: 'New Brunswick', value: 'NB', country: CANADA},
	{text: 'Newfoundland and Labrador', value: 'NL', country: CANADA},
	{text: 'Northwest Territories', value: 'NT', country: CANADA},
	{text: 'Nova Scotia', value: 'NS', country: CANADA},
	{text: 'Nunavut', value: 'NU', country: CANADA},
	{text: 'Ontario', value: 'ON', country: CANADA},
	{text: 'Prince Edward Island', value: 'PE', country: CANADA},
	{text: 'Quebec', value: 'QC', country: CANADA},
	{text: 'Saskatchewan', value: 'SK', country: CANADA},
	{text: 'Yukon', value: 'YT', country: CANADA},
];

export const STATE_EDIT_ADDRESS = 'EDIT_ADDRESS';
export const STATE_ADD_ADDRESS = 'ADD_ADDRESS';
export const STATE_CHECKOUT_ADDRESS = 'CHECKOUT_ADDRESS';