import React from 'react';

function Panel({ children, style = {} }) {
  return (
    <p
      style={{
        borderRadius: '10px',
        padding: '1rem',
        marginLeft: '-1rem',
        marginRight: '-1rem',
        background: 'var(--inlineCode-bg)',
        wordBreak: 'keep-all',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export default Panel;
