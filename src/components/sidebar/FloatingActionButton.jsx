import React from 'react';
import PropTypes from 'prop-types';

/**
 * @name FloatingActionButton
 * @summary Renders a FloatingActionButton
 * @return {jsx} React FAB
 */
const FloatingActionButton = props => (
  <div
    className='fab'
    role='button'
    aria-label=''
    tabIndex='0'
    onClick={props.onClick}
    onKeyDown={props.onClick}
  >
    <div className='fab__line fab__line--1' />
    <div className='fab__line fab__line--2' />
    <div className='fab__line fab__line--3' />
  </div>
);

/**
  * @name propTypes
  * @type {PropType}
  * @param {Object} propTypes - React PropTypes
  * @property {Object} onClick - Event handler for click (and keydown) events
*/
FloatingActionButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default FloatingActionButton;