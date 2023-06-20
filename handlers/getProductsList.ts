import { APIGatewayProxyResult } from 'aws-lambda';
import { constants } from 'http2';
import { getProducts, getStocks } from './dataBase/methods';
import { createResponse } from './utils/utils';
import { Product } from './types/product';

export const handler = async (): Promise<APIGatewayProxyResult> => {
    try {
        console.log(`GetProduct lambda called`);

        const products = await getProducts();
        const stocks = await getStocks();

        const productsWithCounts: Product[] = products.map((product) => {
            const stock = stocks.find(
                (stockItem) => stockItem.product_id === product.id
            );
            return {
                ...product,
                count: stock?.count || null,
            };
        });

        if (!products.length) {
            return createResponse(constants.HTTP_STATUS_NOT_FOUND, []);
        }
        return createResponse(constants.HTTP_STATUS_OK, productsWithCounts);
    } catch (error: any) {
        return createResponse(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR, {
            error: error.message,
        });
    }
};
