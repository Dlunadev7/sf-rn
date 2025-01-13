export const budgetsSelect = [
  { name: 'Matafuego 1kg Polvo ABC', price: 3000, quantity: 15, type: 'Polvo ABC' },
  { name: 'Matafuego 2kg Polvo ABC', price: 4500, quantity: 10, type: 'Polvo ABC' },
  { name: 'Matafuego 5kg Polvo ABC', price: 8000, quantity: 8, type: 'Polvo ABC' },
  { name: 'Matafuego 10kg Polvo ABC', price: 12000, quantity: 5, type: 'Polvo ABC' },
  { name: 'Matafuego 10kg CO2', price: 15000, quantity: 3, type: 'CO2' },
  { name: 'Matafuego 2.5kg CO2', price: 6000, quantity: 12, type: 'CO2' },
  { name: 'Matafuego 3kg Agua Presurizada', price: 3500, quantity: 9, type: 'Agua Presurizada' },
  { name: 'Matafuego 6kg Espuma Química', price: 7000, quantity: 6, type: 'Espuma Química' },
  { name: 'Matafuego 9kg Espuma Química', price: 9500, quantity: 4, type: 'Espuma Química' },
  { name: 'Matafuego Automotor 1kg Polvo ABC', price: 2500, quantity: 20, type: 'Polvo ABC' },
].map((item) => ({
  ...item,
  id: Math.random().toString(36).substr(2, 9), // Genera un ID aleatorio
}));
