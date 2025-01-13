export enum OrdersRoutes {
  ORDERS = 'index',
  ORDERS_CLIENTS = 'list-orders',
  // ORDERS_ID = 'orders/:id',
  ORDERS_CLIENTS_ID = 'order',
  ORDERS_DIRECT_SALE = 'orders/direct_sale',
  ORDERS_BUDGET = 'budget',
  ORDERS_BUDGET_ID = '[id]',
  DIRECT_SALE = 'direct-sale',
  ORDERS_BUDGET_LIST = 'budget-list',
}

export enum OrdersRoutesLink {
  ORDERS_DEFAULT = '/ordenes',
  ORDERS = '/(orders)/',
  ORDERS_CLIENTS = '/(orders)/list-orders',
  ORDERS_ID = '/(orders)/order',
  ORDERS_CLIENTS_ID = '/(orders)/clients/:id',
  ORDERS_DIRECT_SALE = '/(orders)/direct_sale',
  ORDERS_BUDGET = '/(orders)/budget',
  ORDERS_BUDGET_ID = '/(orders)/:id',
  DIRECT_SALE = '/(orders)/direct-sale',
  ORDERS_BUDGET_LIST = '/(orders)/budget-list',
}
