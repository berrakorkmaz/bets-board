import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getBets } from '../../api/betsApi';

export const fetchBets = createAsyncThunk('matches/fetchBets', async () => {
  const data = await getBets();
  return data;
});

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBets.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching bets';
      });
  },
});

export default matchesSlice.reducer;
