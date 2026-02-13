import React from 'react';
import MarketTicker from './MarketTicker';

const Header = ({ exchangeRate, onThemeToggle }) => {
    return (
        <header className="header">
            <h1>🚢 Comex.io</h1>
            <p className="subtitle">Import Hunter</p>

            {exchangeRate && <MarketTicker data={exchangeRate} />}
        </header>
    );
};

export default Header;
