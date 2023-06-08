import * as products from './store.json';

export const getProducts = async () => products;

export const getProductById = async (id: string | undefined) =>
    products.find((product) => product.id === id);
