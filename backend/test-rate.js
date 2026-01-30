import { getExchangeRate } from './services/exchangeService.js';

console.log('Testing Exchange Rate Service...');
try {
    const rate = await getExchangeRate();
    console.log('Result:', rate);
} catch (error) {
    console.error('Error:', error);
}
