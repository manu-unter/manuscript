import React from 'react';

function Panel({ children, style = {} }) {
  return (
    <p
      style={{
        borderRadius: '10px',
        padding: '1.3125rem',
        marginLeft: '-1.3125rem',
        marginRight: '-1.3125rem',
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
