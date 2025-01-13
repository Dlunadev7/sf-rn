export enum ClientsRoutes {
  CLIENTS = 'index',
  CLIENT = '[id]',
  NEW_SALE = 'new-sale',
}

export enum ClientsRoutesLink {
  CLIENTS_DEFAULT = '/clientes',
  CLIENTS = '/(clients)/',
  CLIENT = '/(clients)/:id',
  NEW_SALE = '/(clients)/new-sale',
}

export enum HomeRoutesLink {
  HOME = '/(tabs)/',
}
