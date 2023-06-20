import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { fillDataBase } from '../handlers/dataBase/methods';
dotenv.config();

export class AwsShopReactBeStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const getProductsListLambda = new lambda.Function(
            this,
            'GetProductsListLambda',
            {
                runtime: lambda.Runtime.NODEJS_16_X,
                handler: 'getProductsList.handler',
                functionName: 'getProductsList',
                code: lambda.Code.fromAsset('handlers'),
                environment: {
                    DB_PRODUCTS_NAME: process.env.DB_PRODUCTS_NAME!,
                    DB_STOCKS_NAME: process.env.DB_STOCKS_NAME!,
                },
            }
        );

        const getProductsByIdLambda = new lambda.Function(
            this,
            'GetProductsByIdLambda',
            {
                runtime: lambda.Runtime.NODEJS_16_X,
                handler: 'getProductsById.handler',
                functionName: 'getProductsById',
                code: lambda.Code.fromAsset('handlers'),
                environment: {
                    DB_PRODUCTS_NAME: process.env.DB_PRODUCTS_NAME!,
                    DB_STOCKS_NAME: process.env.DB_STOCKS_NAME!,
                },
            }
        );

        const putProductLambda = new lambda.Function(this, 'PutProductLambda', {
            runtime: lambda.Runtime.NODEJS_16_X,
            handler: 'putProduct.handler',
            functionName: 'putProduct',
            code: lambda.Code.fromAsset('handlers'),
            environment: {
                DB_PRODUCTS_NAME: process.env.DB_PRODUCTS_NAME!,
                DB_STOCKS_NAME: process.env.DB_STOCKS_NAME!,
            },
        });

        const api = new apigateway.RestApi(this, 'ProductServiceAPI');

        const productsResource = api.root.addResource('products');
        productsResource.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getProductsListLambda)
        );

        productsResource.addMethod(
            'PUT',
            new apigateway.LambdaIntegration(putProductLambda)
        );

        const productByIdResource = productsResource.addResource('{productId}');
        productByIdResource.addMethod(
            'GET',
            new apigateway.LambdaIntegration(getProductsByIdLambda)
        );
    }
}
