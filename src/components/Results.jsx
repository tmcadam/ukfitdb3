import React, { useState } from 'react';

/**
 * Results component - displays search results in an expandable table.
 * Mirrors the Angular ResultsComponent.
 */
function Results({ results }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleExpandRow = (row) => {
    setExpandedRow(expandedRow === row ? null : row);
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="results-container">
      {/* Desktop table view */}
      <div className="desktop-only">
        <table className="results-table striped">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>Title</th>
              <th style={{ width: '70px' }}>Year</th>
              <th>Authors</th>
            </tr>
          </thead>
          <tbody>
            {results.map((pub, index) => (
              <React.Fragment key={pub.id}>
                <tr
                  className={`result-row ${expandedRow === index ? 'expanded' : ''}`}
                  onClick={() => toggleExpandRow(index)}
                >
                  <td>
                    <span className={`expand-icon ${expandedRow === index ? 'expanded' : ''}`}>
                      {expandedRow === index ? '▼' : '▶'}
                    </span>
                  </td>
                  <td>{pub.title}</td>
                  <td>{pub.year}</td>
                  <td>{pub.authors}</td>
                </tr>
                {expandedRow === index && (
                  <tr className="detail-row">
                    <td colSpan="4">
                      <div className="table-detail">
                        <div className="heading id">#: {pub.id}</div>
                        <div className="table">
                          <table>
                            {pub.reference && (
                              <tr>
                                <td className="heading">Reference: </td>
                                <td>{pub.reference}</td>
                              </tr>
                            )}
                            {pub.keywords && (
                              <tr>
                                <td className="heading">Keywords: </td>
                                <td>{pub.keywords}</td>
                              </tr>
                            )}
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile list view */}
      <div className="mobile-only">
        <div className="collapsible-counter">{results.length} found</div>
        <ul className="collapsible-list">
          {results.map((pub) => (
            <li key={pub.id} className="collapsible-item">
              <div className="collapsible-header">
                <div className="collapsible-header-title">
                  {pub.title.length > 60 ? `${pub.title.substring(0, 60)}...` : pub.title}
                </div>
                <div className="collapsible-id">#{pub.id}</div>
              </div>
              <div className="collapsible-body">
                <span className="collapsible-full-title">{pub.title}</span>{' '}
                {pub.authors} ({pub.year}). <i>{pub.reference}</i>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Results;
