import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { constants } from 'http2';
import { putProduct } from './dataBase/methods';
import { createResponse } from './utils/utils';
import { Product } from './types/product';

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        console.log(`PutProduct body: ${event?.body}`);

        if (!event?.body) {
            return createResponse(constants.HTTP_STATUS_BAD_REQUEST, null);
        }

        const product = JSON.parse(event?.body) as Product;

        if (
            !product ||
            !product.title ||
            !product.price ||
            !product.description ||
            !product.count
        ) {
            return createResponse(constants.HTTP_STATUS_BAD_REQUEST, null);
        }

        const newProduct = await putProduct(product);

        return createResponse(constants.HTTP_STATUS_OK, newProduct);
    } catch (error: any) {
        return createResponse(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
            error: error.message,
        });
    }
};
