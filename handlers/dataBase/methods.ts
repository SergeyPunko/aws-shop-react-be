import * as products from './store.json';
import * as AWS from 'aws-sdk';
import { randomUUID } from 'crypto';
import { Product } from '../types/product';
import { Stock } from '../types/stock';

const dynamodb = new AWS.DynamoDB.DocumentClient();


export const getProducts = async (): Promise<Product[]> => {
    const products = await dynamodb
        .scan({
            TableName: process.env.DB_PRODUCTS_NAME!,
        })
        .promise();
    return products.Items as Product[];
};


export const putProduct = async (product: Product): Promise<Product> => {
    const productId = randomUUID();

    const productItem: Product = {
        title: product.title,
        description: product.description,
        price: product.price,
        id: productId,
    };

    const stockItem: Stock = {
        product_id: productId,
        count: product.count || 0,
    };

    await dynamodb
        .transactWrite({
            TransactItems: [
                {
                    Put: {
                        TableName: process.env.DB_STOCKS_NAME!,
                        Item: stockItem,
                    }
                },
                {
                    Put: {
                        TableName: process.env.DB_PRODUCTS_NAME!,
                        Item: productItem,
                    },
                },
            ],
        })
        .promise();

    return product;
};


export const getProductById = async (
    id: string | undefined
): Promise<Product> => {
    const products = await dynamodb
        .query({
            TableName: process.env.DB_PRODUCTS_NAME!,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id,
            },
            Limit: 1,
        })
        .promise();
    return products.Items?.[0] as Product;
};


export const getStocks = async (): Promise<Stock[]> => {
    const products = await dynamodb
        .scan({
            TableName: process.env.DB_STOCKS_NAME!,
        })
        .promise();
    return products.Items as Stock[];
};


export const getStockForProductId = async (
    id: string | undefined
): Promise<Stock> => {
    const products = await dynamodb
        .query({
            TableName: process.env.DB_STOCKS_NAME!,
            KeyConditionExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': id,
            },
            Limit: 1,
        })
        .promise();
    return products.Items?.[0] as Stock;
};


export const fillDataBase = () => {
    products.forEach(async (product) => {
        await putProduct(product);
    });
};
