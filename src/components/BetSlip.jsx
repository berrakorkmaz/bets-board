import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearSelections,
  removeSelection,
} from '../features/betSlip/betSlipSlice';

const BetSlip = () => {
  const dispatch = useDispatch();

  const selections = useSelector((state) => state.betSlip.selections);

  const totalOdds = selections.reduce(
    (total, selection) => total * Number(selection.value || 1),
    1,
  );

  return (
    <div className="bet-slip">
      <h2 className="bet-slip__title">Kupon</h2>

      {selections.length === 0 ? (
        <p className="bet-slip__empty">Henüz seçim yok</p>
      ) : (
        <>
          {selections.map((item) => (
            <div key={item.selectionId} className="bet-slip__item">
              <p className="bet-slip__match">{item.matchName}</p>

              <p className="bet-slip__market">
                {item.marketName} / {item.label}
              </p>

              <p className="bet-slip__odd">Oran: {item.value}</p>

              <button
                className="bet-slip__remove"
                onClick={() => dispatch(removeSelection(item.selectionId))}
              >
                Sil
              </button>
            </div>
          ))}

          <div className="bet-slip__footer">
            <p className="bet-slip__total">
              Toplam Oran: {totalOdds.toFixed(2)}
            </p>

            <button
              className="bet-slip__clear"
              onClick={() => dispatch(clearSelections())}
            >
              Kuponu Temizle
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BetSlip;
