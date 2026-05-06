export const getMarketColumns = (matches) => {
  const marketMap = new Map();

  const DEFAULT_MARKET_LABELS = {
    1: ['1', 'X', '2'],
    2: ['1-X', '1-2', 'X-2'],
    5: ['Alt', 'Üst'],
  };

  matches.forEach((match) => {
    Object.values(match.OCG || {}).forEach((market) => {
      if (!marketMap.has(market.ID)) {
        marketMap.set(market.ID, {
          id: market.ID,
          name: market.N,
          labels: new Map(),
        });
      }

      Object.values(market.OC || {}).forEach((odd) => {
        if (odd.N) {
          marketMap.get(market.ID).labels.set(odd.N, odd.N);
        }
      });
    });
  });

  return Array.from(marketMap.values()).map((market) => ({
    ...market,
    labels:
      DEFAULT_MARKET_LABELS[market.id] || Array.from(market.labels.values()),
  }));
};

export const normalizeMatch = (match) => {
  const oddsByMarket = {};

  Object.values(match.OCG || {}).forEach((market) => {
    oddsByMarket[market.ID] = {};

    Object.values(market.OC || {}).forEach((odd) => {
      if (!odd.N || !odd.O) return;

      oddsByMarket[market.ID][odd.N] = {
        id: odd.ID,
        label: odd.N,
        value: odd.O,
        marketId: market.ID,
        marketName: market.N,
        mbs: odd.MBS || market.MBS,
      };
    });
  });

  return {
    id: match.C,
    code: match.C,
    matchName: match.N,
    leagueName: match.LN,
    date: match.D,
    day: match.DAY,
    time: match.T,
    status: match.S,
    oddsByMarket,
  };
};
