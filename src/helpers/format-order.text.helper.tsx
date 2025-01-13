export const formatOrderText = (count: number, type?: string): string => {
  if (type === 'budget') {
    return `${count} ${count === 1 ? 'Presupuesto' : 'Presupuestos'}`;
  }

  return `${count} ${count === 1 ? 'Órden' : 'Órdenes'}`;
};
