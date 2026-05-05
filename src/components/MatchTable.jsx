import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addSelection } from '../features/betSlip/betSlipSlice';

const MatchTable = ({ matches, marketColumns }) => {
  const dispatch = useDispatch();

  const selections = useSelector((state) => state.betSlip.selections);

  const isSelected = (selectionId) =>
    selections.some((selection) => selection.selectionId === selectionId);

  return (
    <>
      <div className="match-table">
        <table>
          <thead>
            <tr>
              <th rowSpan="2">Kod</th>
              <th rowSpan="2">Tarih</th>
              <th rowSpan="2">Gün</th>
              <th rowSpan="2">Saat</th>
              <th rowSpan="2">Lig</th>
              <th rowSpan="2">Maç</th>
              <th rowSpan="2">Durum</th>

              {marketColumns.map((market) => (
                <th key={market.id} colSpan={market.labels.length}>
                  {market.name}
                </th>
              ))}
            </tr>
            <tr>
              {marketColumns.map((market) =>
                market.labels.map((label) => (
                  <th key={`${market.id}-${label}`}>{label}</th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match.id}>
                <td>{match.code}</td>
                <td>{match.date}</td>
                <td>{match.day}</td>
                <td>{match.time}</td>
                <td>{match.leagueName}</td>
                <td>{match.matchName}</td>
                <td>{match.status}</td>

                {marketColumns.map((market) =>
                  market.labels.map((label) => {
                    const odd = match.oddsByMarket[market.id]?.[label];
                    const selectionId = `${match.id}-${market.id}-${label}`;

                    return (
                      <td key={selectionId}>
                        {odd ? (
                          <button
                            type="button"
                            className={`match-table__odd ${
                              isSelected(selectionId) ? 'selected' : ''
                            }`}
                            onClick={() =>
                              dispatch(
                                addSelection({
                                  selectionId,
                                  matchId: match.id,
                                  matchName: match.matchName,
                                  marketId: market.id,
                                  marketName: market.name,
                                  label,
                                  value: odd.value,
                                }),
                              )
                            }
                          >
                            {odd.value}
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    );
                  }),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="match-cards">
        {matches.map((match) => (
          <div key={match.id} className="match-card">
            <div className="match-card__header">
              <span>{match.leagueName}</span>
              <span>
                {match.date} - {match.time}
              </span>
            </div>

            <h3 className="match-card__title">{match.matchName}</h3>

            <p className="match-card__status">{match.status}</p>

            {marketColumns.map((market) => (
              <div key={market.id} className="match-card__market">
                <p className="match-card__market-title">{market.name}</p>

                <div className="match-card__odds">
                  {market.labels.map((label) => {
                    const odd = match.oddsByMarket[market.id]?.[label];
                    const selectionId = `${match.id}-${market.id}-${label}`;

                    return odd ? (
                      <button
                        key={selectionId}
                        type="button"
                        className={`match-card__odd ${
                          isSelected(selectionId) ? 'selected' : ''
                        }`}
                        onClick={() =>
                          dispatch(
                            addSelection({
                              selectionId,
                              matchId: match.id,
                              matchName: match.matchName,
                              marketId: market.id,
                              marketName: market.name,
                              label,
                              value: odd.value,
                            }),
                          )
                        }
                      >
                        <span>{label}</span>
                        <strong>{odd.value}</strong>
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default MatchTable;
