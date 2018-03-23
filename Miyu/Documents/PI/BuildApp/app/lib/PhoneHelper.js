import environment from './environment';

const phoneHelper = {
	formatPhoneNumber({ phoneNumber, extension }) {
		if (!phoneNumber) {
			return '';
		}

		let result = phoneNumber.toString().replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
		if (extension) {
			result = `${result} x${extension}`;
		}

		return result;
	},

	getGeneralPhoneNumber() {
		return {
			phoneNumber: environment.phone,
			extension: '',
		};
	},

	getPhoneNumberByUserType(user = {}) {
		const {
			isPro = false,
			rep = {},
		} = user;
		const { repWorkPhone = '' } = rep;

		return {
			phoneNumber: isPro && !repWorkPhone ? environment.proSupportPhone : environment.phone,
			extension: isPro && repWorkPhone ? repWorkPhone : '',
		};
	},
};

module.exports = phoneHelper;
