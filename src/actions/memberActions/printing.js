import {
  PRINT_END,
  PRINT_START,
} from '../actionTypes';

export const endPrinting = () => ({
  type: PRINT_END,
});

export const startPrinting = amount => ({
  amount: amount || 0,
  type: PRINT_START,
});
