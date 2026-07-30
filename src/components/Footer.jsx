import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer = () => {
  const { data } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <footer style={{ padding: '2.5rem 0', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', textAlign: 'center' }}>
      <div className="container">
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          © {year} {data.profile.name}. Built with React, Vite & Modern CSS.
        </p>
      </div>
    </footer>
  );
};
