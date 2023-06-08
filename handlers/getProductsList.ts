import { APIGatewayProxyResult } from 'aws-lambda';
import { constants } from 'http2';
import { getProducts } from './dataBase/methods';
import { createResponse } from './utils/utils';

export const handler = async (): Promise<APIGatewayProxyResult> => {
	try {
		const products = await getProducts();

		if (!products.length) {
			return createResponse(constants.HTTP_STATUS_NOT_FOUND, products);
		}
		return createResponse(constants.HTTP_STATUS_OK, products);
	} catch (error: any) {
		return createResponse(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
			error: error.message,
		});
	}
};
