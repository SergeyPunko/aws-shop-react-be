import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { constants } from 'http2';
import { getProductById, getStockForProductId } from './dataBase/methods';
import { createResponse } from './utils/utils';
import { Product } from './types/product';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const productId = event.pathParameters?.productId;

        console.log(
            `GetProductById lambda called with parameter: ${productId}`
        );

        const product = await getProductById(productId);
        const stock = await getStockForProductId(productId);

        if (!product) {
            return createResponse(constants.HTTP_STATUS_NOT_FOUND, null);
        }

        const productWithStockCount: Product = {
            ...product,
            count: stock?.count || null,
        };

        return createResponse(constants.HTTP_STATUS_OK, productWithStockCount);
    } catch (error: any) {
        return createResponse(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
            error: error.message,
        });
    }
};
