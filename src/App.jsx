import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchBets } from './features/matches/matchesSlice';
import MatchTable from './components/MatchTable';
import BetSlip from './components/BetSlip';
import { getMarketColumns, normalizeMatch } from './utils/betMappers';

function App() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.matches);

  useEffect(() => {
    dispatch(fetchBets());
  }, [dispatch]);

  const marketColumns = useMemo(() => {
    return getMarketColumns(data);
  }, [data]);

  const formattedMatches = useMemo(() => {
    return data.map(normalizeMatch);
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app">
      <header className="app__header">
        <h1>Bülten</h1>
      </header>
      <div className="app__layout">
        <main className="app__content">
          <MatchTable
            matches={formattedMatches}
            marketColumns={marketColumns}
          />
        </main>
        <BetSlip />
      </div>
    </div>
  );
}

export default App;
