import { createSlice } from '@reduxjs/toolkit';

import { loadFromStorage, saveToStorage } from '../../utils/storage';

const STORAGE_KEY = 'betSlipSelections';

const initialState = {
  selections: loadFromStorage(STORAGE_KEY, []),
};

const betSlipSlice = createSlice({
  name: 'betSlip',
  initialState,
  reducers: {
    //Aynı oran tekrar tıklanırsa kupondan çıkar
    //Aynı maç + aynı markette başka oran seçilirse eskisi silinir, yenisi eklenir
    //Aynı maç + farklı market seçilirse kupona eklenir
    addSelection: (state, action) => {
      const selectedOdd = action.payload;

      const sameSelectionExists = state.selections.some(
        (selection) => selection.selectionId === selectedOdd.selectionId,
      );

      if (sameSelectionExists) {
        state.selections = state.selections.filter(
          (selection) => selection.selectionId !== selectedOdd.selectionId,
        );
        return;
      }

      state.selections = state.selections.filter(
        (selection) =>
          !(
            selection.matchId === selectedOdd.matchId &&
            selection.marketId === selectedOdd.marketId
          ),
      );

      state.selections.push(selectedOdd);

      saveToStorage(STORAGE_KEY, state.selections);
    },

    removeSelection: (state, action) => {
      state.selections = state.selections.filter(
        (selection) => selection.selectionId !== action.payload,
      );

      saveToStorage(STORAGE_KEY, state.selections);
    },

    clearSelections: (state) => {
      state.selections = [];

      saveToStorage(STORAGE_KEY);
    },
  },
});

export const { addSelection, removeSelection, clearSelections } =
  betSlipSlice.actions;

export default betSlipSlice.reducer;
