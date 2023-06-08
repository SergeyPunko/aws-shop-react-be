import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class AwsShopReactBeStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const getProductsListLambda = new lambda.Function(
			this,
			'GetProductsListLambda',
			{
				runtime: lambda.Runtime.NODEJS_18_X,
				handler: 'getProductsList.handler',
				functionName: 'getProductsList',
				code: lambda.Code.fromAsset('handlers'),
				environment: {
					NODE_OPTIONS: '--enable-source-maps',
				},
			}
		);

		const getProductsByIdLambda = new lambda.Function(
			this,
			'GetProductsByIdLambda',
			{
				runtime: lambda.Runtime.NODEJS_18_X,
				handler: 'getProductsById.handler',
				functionName: 'getProductsById',
				code: lambda.Code.fromAsset('handlers'),
				environment: {
					NODE_OPTIONS: '--enable-source-maps',
				},
			}
		);

		const api = new apigateway.RestApi(this, 'ProductServiceAPI');

		const productsResource = api.root.addResource('products');
		productsResource.addMethod(
			'GET',
			new apigateway.LambdaIntegration(getProductsListLambda)
		);

		const productByIdResource = productsResource.addResource('{productId}');
		productByIdResource.addMethod(
			'GET',
			new apigateway.LambdaIntegration(getProductsByIdLambda)
		);
	}
}
