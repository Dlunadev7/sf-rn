export enum ProductsRoute {
  PRODUCTS = 'index',
  PRODUCT = 'product',
  PRODUCT_INFO = '[id]',
  CATALOG = 'catalog',
  LIST = 'list',
  PRODUCT_LIST = 'productList',
}

export enum ProductsRoutesLink {
  PRODUCTS = '/(products)/',
  PRODUCT = '/(products)/product',
  PRODUCT_INFO = '/(products)/:id',
  CATALOG = '/(products)/catalog',
  LIST = '/(products)/list',
  PRODUCT_LIST = '/(products)/productList',
}
