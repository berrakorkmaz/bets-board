import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addSelection } from '../features/betSlip/betSlipSlice';

import SearchIcon from '../icons/SearchIcon';

const ITEMS_PER_LOAD = 20;

const MatchSearch = ({ value, onChange }) => {
  return (
    <div className="match-search">
      <SearchIcon />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Lig ya da maç adı giriniz"
        className="match-search__input"
      />
    </div>
  );
};

const MatchTable = ({ matches, marketColumns }) => {
  const dispatch = useDispatch();

  const selections = useSelector((state) => state.betSlip.selections);

  const [searchText, setSearchText] = useState('');

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const filteredMatches = useMemo(() => {
    const normalizedSearchText = searchText.trim().toLowerCase();

    if (!normalizedSearchText) {
      return matches;
    }

    return matches.filter((match) => {
      const matchName = match.matchName?.toLowerCase() || '';
      const leagueName = match.leagueName?.toLowerCase() || '';

      return (
        matchName.includes(normalizedSearchText) ||
        leagueName.includes(normalizedSearchText)
      );
    });
  }, [matches, searchText]);

  const visibleMatches = useMemo(() => {
    return filteredMatches.slice(0, visibleCount);
  }, [filteredMatches, visibleCount]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [searchText]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 400;

      if (scrollPosition >= threshold) {
        setVisibleCount((prev) => {
          if (prev >= filteredMatches.lenght) return prev;
          return prev + ITEMS_PER_LOAD;
        });
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filteredMatches.length]);

  const isSelected = (selectionId) =>
    selections.some((selection) => selection.selectionId === selectionId);

  return (
    <>
      <div className="match-table">
        <MatchSearch
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
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
            {visibleMatches.map((match) => (
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
        {visibleMatches.map((match) => (
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
