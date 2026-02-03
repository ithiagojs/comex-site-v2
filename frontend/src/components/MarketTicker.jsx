import React from 'react';
import './MarketTicker.css';
import { formatBRL, formatUSD, formatPercent } from '../utils/formatters';

const MarketTicker = ({ data }) => {
    if (!data || !data.currencies) return null;

    const { currencies, stocks } = data;

    const renderVariation = (variation) => {
        const val = Number(variation);
        const color = val >= 0 ? '#10b981' : '#ef4444';
        const icon = val >= 0 ? '▲' : '▼';
        return <span style={{ color, fontSize: '0.8rem', marginLeft: '4px' }}>{icon} {Math.abs(val).toFixed(2)}%</span>;
    };

    const TickerItems = () => (
        <div className="ticker-group">
            {/* Currencies */}
            <div className="ticker-item currency">
                <span className="ticker-label">🇺🇸 USD</span>
                <span className="ticker-value">R$ {formatBRL(currencies.USD.rate)}</span>
                {renderVariation(currencies.USD.variation)}
            </div>

            <div className="ticker-item currency">
                <span className="ticker-label">🇪🇺 EUR</span>
                <span className="ticker-value">R$ {formatBRL(currencies.EUR.rate)}</span>
                {renderVariation(currencies.EUR.variation)}
            </div>

            <div className="ticker-item currency">
                <span className="ticker-label">🇨🇳 CNY</span>
                <span className="ticker-value">R$ {formatBRL(currencies.CNY.rate)}</span>
                {renderVariation(currencies.CNY.variation)}
            </div>

            <div className="ticker-divider"></div>

            {/* Stocks */}
            {stocks && stocks.map(stock => (
                <div className="ticker-item stock" key={stock.symbol}>
                    <span className="ticker-label">{stock.name} ({stock.symbol})</span>
                    <span className="ticker-value">$ {stock.price}</span>
                    {renderVariation(stock.variation)}
                </div>
            ))}
        </div>
    );

    return (
        <div className="market-ticker-container">
            <div className="market-ticker-scroll">
                {/* Duplicate content for seamless infinite scroll */}
                <TickerItems />
                <TickerItems />
                <TickerItems />
            </div>
        </div>
    );
};

export default MarketTicker;
