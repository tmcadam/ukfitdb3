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
      <h6 className="text-gray-500 text-lg font-normal mt-2">
        Welcome to the FIT Publications Database
      </h6>
      <p className="mt-4">
        In the 1990s a need was identified by the Falkland Islands Government to
        co-ordinate within the Falkland Islands as much as possible of ongoing
        scientific activity to ensure the most efficient and effective use of
        available scientific resources. An essential component of this was the
        documentation of all previously and currently published scientific
        information in a readily available form for both scientists and students
        to use.
      </p>
      <p className="mt-4">
        A comprehensive database has been prepared by{' '}
        <a
          href="https://www.ukfit.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          Falkland Islands Trust
        </a>{' '}
        (with support from Fortuna Ltd and The Falkland Islands Government)
        containing many previously inaccessible entries. The database is of
        value to the scientific, commercial and educational sectors in the
        Falkland Islands. Use the search box at the top this page to begin using
        the database. Currently the database is managed by the Falkland Islands
        Trust. If you have any suggestions or queries contact{' '}
        <a
          href="mailto:jim.mcadam@ukfit.org"
          className="text-primary hover:underline font-medium"
        >
          Professor Jim McAdam
        </a>
        .
      </p>
      <p className="mt-4 text-center">
        <span className="font-semibold">
          Developed by the Falkand Islands Trust with the support of the
          Falkland Islands Government and Fortuna Ltd.
        </span>
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mt-12">
        <div className="flex justify-center md:justify-end flex-1">
          <img
            src={fitLogo}
            alt="FIT Logo"
            className="w-40 md:w-48 h-auto object-contain"
          />
        </div>
        <div className="flex flex-col items-center md:items-start justify-center gap-8 flex-1">
          <img
            src={fkLogo}
            alt="FK Logo"
            className="w-40 md:w-44 h-auto object-contain"
          />
          <img
            src={fortunaLogo}
            alt="Fortuna Logo"
            className="w-40 md:w-44 h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Introduction;
