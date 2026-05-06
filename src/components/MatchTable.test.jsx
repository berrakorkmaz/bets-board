import React from 'react';

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import MatchTable from './MatchTable';
import betSlipReducer from '../features/betSlip/betSlipSlice';

const mockMatches = [
  {
    id: 1,
    code: 2001,
    date: '12.08.2023',
    day: 'Perşembe',
    time: '20:00',
    leagueName: 'Türkiye Süper Ligi',
    matchName: 'Galatasaray - Fenerbahçe',
    status: 'Canlı',
    oddsByMarket: {
      matchResult: {
        MS1: {
          value: '1.85',
        },
      },
    },
  },
];

const mockMarketColumns = [
  {
    id: 'matchResult',
    name: 'Maç Sonucu',
    labels: ['MS1'],
  },
];

const createTestStore = () =>
  configureStore({
    reducer: {
      betSlip: betSlipReducer,
    },
  });

const renderMatchTable = () => {
  return render(
    <Provider store={createTestStore()}>
      <MatchTable matches={mockMatches} marketColumns={mockMarketColumns} />
    </Provider>,
  );
};

describe('MatchTable', () => {
  test('search input render edilir', () => {
    renderMatchTable();

    const searchInput = screen.getByPlaceholderText(
      /Lig ya da maç adı giriniz/i,
    );

    expect(searchInput).toBeInTheDocument();
  });

  test('maç adını render eder', () => {
    renderMatchTable();

    expect(
      screen.queryAllByText('Galatasaray - Fenerbahçe').length,
    ).toBeGreaterThan(0);
  });

  test('oran butonunu render eder', () => {
    renderMatchTable();

    expect(screen.queryAllByText('1.85').length).toBeGreaterThan(0);
  });
});
