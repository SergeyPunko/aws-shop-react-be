import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { constants } from 'http2';
import { getProductById } from './dataBase/methods';
import { createResponse } from './utils/utils';

export const handler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	try {
		const productId = event.pathParameters?.productId;
		const product = await getProductById(productId);

		if (!product) {
			return createResponse(constants.HTTP_STATUS_NOT_FOUND, null);
		}
		return createResponse(constants.HTTP_STATUS_OK, product);
	} catch (error: any) {
		return createResponse(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
			error: error.message,
		});
	}
};
