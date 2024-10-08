'use client';

import React from 'react';
import { TableRow } from '../interface/TableRows';
import plotly from 'plotly.js';
import createPlotComponent from 'react-plotly.js/factory';
const Plot = createPlotComponent(plotly);
interface BarChartProps {
  checkedRows: TableRow[];
}

const BarChart: React.FC<BarChartProps> = ({ checkedRows }) => {
  const ids = checkedRows.map((row) => row.id);
  const prices = checkedRows.map((row) => row.price);

  function getRandomColors(): string | undefined {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: ids,
          y: prices,
          width: prices.map((price) => {
            // Thin bar for prices less than 10
            if (price < 10) {
              return 0.5; 
            } else if (price >= 10 && price <= 20) {
             // Regular width for prices between 10 and 20
              return 0.8; 
            } else {
             // Wider bar for prices greater than 20
              return 1.5;
            }
          }),
          hoverinfo: 'x+y',
          hoverlabel: { bgcolor: '#FFFFFF', font: { size: 12, color: '#000000' } },
          fillcolor: getRandomColors()
        }
      ]}
      layout={{
        title: {
          text: 'Checked Rows Price Chart',
          font: { size: 15, color: '#4A4A4A' },
          x: 0.45,
        },
        xaxis: {
          title: {
            text: 'IDs',
            font: { size: 18, color: '#333333' },
          },
          tickfont: { size: 14, color: '#333333' },
          showgrid: false, 
        },
        yaxis: {
          title: {
            text: 'Prices',
            font: { size: 18, color: '#333333' },
          },
          tickfont: { size: 14, color: '#333333' },
          showgrid: true,
          gridcolor: '#D3D3D3',
        },
        plot_bgcolor: '#F5F5F5',
        paper_bgcolor: '#FFFFFF',
        margin: { t: 50, b: 80, l: 50, r: 50 },
        bargap: 0.15,
        bargroupgap: 0.1
      }}
    />
  );
};

export default BarChart;
