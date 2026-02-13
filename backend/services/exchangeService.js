import axios from 'axios';

/**
 * Exchange Service - Integração com APIs Gratuitas e Simulação Financeira
 * Busca cotação USD, EUR, CNY e simula Ações
 */

const AWESOME_API_URL = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,CNY-BRL';

const FALLBACK_RATES = {
    USD: 5.80,
    EUR: 6.20,
    CNY: 0.80
};

// Mock de Ações (Valores aproximados em USD - Fev/2026)
const STOCKS = [
    { symbol: 'MELI', name: 'Mercado Livre', price: 2058.60 },
    { symbol: 'SE', name: 'Shopee', price: 106.26 },
    { symbol: 'BABA', name: 'Alibaba', price: 159.14 },
    { symbol: 'AMZN', name: 'Amazon', price: 232.99 }
];

function generateRandomVariation(basePrice) {
    const variation = (Math.random() - 0.5) * 4; // +/- 2%
    return {
        price: (basePrice * (1 + variation / 100)).toFixed(2),
        variation: variation.toFixed(2)
    };
}

export async function getExchangeRate() {
    let currencies = {};

    // 1. Fetch Currencies
    try {
        console.log(`Fetching multicurrency rates from AwesomeAPI...`);
        const response = await axios.get(AWESOME_API_URL, { timeout: 5000 });
        const data = response.data;

        currencies = {
            USD: {
                rate: parseFloat(data.USDBRL.ask),
                variation: parseFloat(data.USDBRL.pctChange)
            },
            EUR: {
                rate: parseFloat(data.EURBRL.ask),
                variation: parseFloat(data.EURBRL.pctChange)
            },
            CNY: {
                rate: parseFloat(data.CNYBRL.ask),
                variation: parseFloat(data.CNYBRL.pctChange)
            }
        };
    } catch (error) {
        console.warn('Failed to fetch currencies:', error.message);
        // Fallback
        currencies = {
            USD: { rate: FALLBACK_RATES.USD, variation: 0 },
            EUR: { rate: FALLBACK_RATES.EUR, variation: 0 },
            CNY: { rate: FALLBACK_RATES.CNY, variation: 0 }
        };
    }

    // 2. Generate Mock Stocks
    const stocks = STOCKS.map(stock => {
        const data = generateRandomVariation(stock.price);
        return {
            symbol: stock.symbol,
            name: stock.name,
            price: data.price,
            variation: data.variation
        };
    });

    return {
        rate: currencies.USD.rate, // Maintain backward compatibility for calculations
        currencies,
        stocks,
        timestamp: new Date().toISOString(),
        source: 'AwesomeAPI + MockData'
    };
}
