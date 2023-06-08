type Headers = Record<string, string>;

export const CORS_HEADER: Headers = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET',
};

export const createResponse = (
    statusCode: number,
    body: any,
    headers: Headers = CORS_HEADER
) => ({
    statusCode,
    headers,
    body: JSON.stringify(body),
});
