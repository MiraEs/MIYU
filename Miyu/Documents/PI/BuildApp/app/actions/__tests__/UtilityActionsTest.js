
import UtilityActions from '../UtilityActions';
import httpClient from '../../services/httpClient';

describe('UtilityActions', () => {
	describe('getZipCodeInfo', () => {
		it('should return a function', () => {
			expect(typeof UtilityActions.getZipCodeInfo()).toEqual('function');
		});
		it('should call httpClient.get', () => {
			UtilityActions.getZipCodeInfo(12345)();
			expect(httpClient.get).toBeCalledWith('/v1/utility/validation/zipcode/12345');
		});
	});

});
