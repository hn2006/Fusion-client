import React from 'react';
import PropTypes from 'prop-types';
import { Table } from '@mantine/core';

export default function FusionTable({ columnNames, elements, width = '100%' }) {
  return (
    <div style={{ overflowX: 'auto', width }}>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            {columnNames.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {elements.map((row, idx) => (
            <tr key={idx}>
              {columnNames.map(col => (
                <td key={col}>
                  {row[col] != null ? row[col] : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

FusionTable.propTypes = {
  columnNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  elements: PropTypes.arrayOf(
    PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.node,
      ])
    )
  ).isRequired,
  width: PropTypes.string,
};
