import { configureStore } from '@reduxjs/toolkit';

import matchesReducer from '../features/matches/matchesSlice';
import betSlipReducer from '../features/betSlip/betSlipSlice';

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    betSlip: betSlipReducer,
  },
});
