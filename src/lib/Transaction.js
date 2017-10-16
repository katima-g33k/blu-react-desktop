export const Type = {
  ADD: 'ADD',
  SELL: 'SELL',
  SELL_PARENT: 'SELL_PARENT',
  PAY: 'PAY',
  DONATE: 'DONATE',
  AJUST_INVENTORY: 'AJUST_INVENTORY',
};

const Transaction = {
  type: Type,
};

Transaction.type.getAllSell = () => [Type.SELL, Type.SELL_PARENT];
Transaction.type.getAsArray = () => Object.keys(Type).map(key => Type[key]);

export default Transaction;
