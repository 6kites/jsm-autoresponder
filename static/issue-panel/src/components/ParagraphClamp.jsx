import './ParagraphClamp.css';
import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';

/**
 * ParagraphClamp Component
 * @param {object} props - { id, text }
 * @param {string} props.id - an HTML element ID
 * @param {string} props.text - a text string for the `<p>` element
 * @returns {React.ReactElement}
 */
export default function ParagraphClamp({ id, text }) {
  const [clamped, setClamped] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const ref = useRef(null);
  const pStyle = { whiteSpace: 'pre-line' } // to show new line
  const btnStyle = { paddingLeft: '0px' }

  useEffect(() => {
    if (ref.current) {
      setShowButton(ref.current.scrollHeight !== ref.current.clientHeight)
    }
  }, [text])

  const onClick = () => setClamped(!clamped);

  return (
    <>
      <p 
        id={id}
        className={clamped ? 'clamp' : ''}
        ref={ref}
        style={pStyle}
      >
        {text}
      </p>
      {showButton && (<Button appearance='link' onClick={onClick} style={btnStyle}>Show {clamped ? "more..." : "less..."}</Button>)}
    </>
  );
}

ParagraphClamp.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}
