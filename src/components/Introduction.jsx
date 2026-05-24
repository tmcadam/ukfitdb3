import React from 'react';
import fitLogo from '../../fit-logo.png';
import fkLogo from '../../fk-logo.png';
import fortunaLogo from '../../fortuna-logo.png';

/**
 * Introduction component - shows welcome page when in HOME state.
 * Mirrors the Angular IntroductionComponent.
 */
function Introduction() {
  return (
    <div className="introduction-container">
      <h5>Welcome to the FIT Publications Database</h5>
      <p>
        In the 1990s a need was identified by the Falkland Islands Government to
        co-ordinate within the Falkland Islands as much as possible of ongoing
        scientific activity to ensure the most efficient and effective use of
        available scientific resources. An essential component of this was the
        documentation of all previously and currently published scientific
        information in a readily available form for both scientists and students
        to use.
      </p>
      <p>
        A comprehensive database has been prepared by{' '}
        <a href="https://www.ukfit.org" target="_blank" rel="noopener noreferrer">
          Falkland Islands Trust
        </a>{' '}
        (with support from Fortuna Ltd and The Falkland Islands Government)
        containing many previously inaccessible entries. The database is of
        value to the scientific, commercial and educational sectors in the
        Falkland Islands. Use the search box at the top this page to begin using
        the database. Currently the database is managed by the Falkland Islands
        Trust. If you have any suggestions or queries contact{' '}
        <a href="mailto:jim.mcadam@ukfit.org">Professor Jim McAdam</a>.
      </p>
      <p>
        <b>
          Developed by the Falkand Islands Trust with the support of the Falkland
          Islands Government and Fortuna Ltd.
        </b>
      </p>
      <div className="container logos">
        <div className="row">
          <div className="col s0 m2 l2"></div>
          <div className="col s12 m4 l4 center-align">
            <img src={fitLogo} alt="FIT Logo" className="responsive-img" />
          </div>
          <div className="col s12 m4 l4 center-align">
            <div className="row img-row">
              <img src={fkLogo} alt="FK Logo" className="responsive-img" />
            </div>
            <div className="row img-row">
              <img src={fortunaLogo} alt="Fortuna Logo" className="responsive-img" />
            </div>
          </div>
          <div className="col s0 m2 l2"></div>
        </div>
      </div>
    </div>
  );
}

export default Introduction;
