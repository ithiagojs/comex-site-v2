import axios from 'axios';

async function checkRates() {
    try {
        const response = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        const data = response.data.USDBRL;
        console.log('Full Data:', data);
        console.log('Bid (Compra):', data.bid);
        console.log('Ask (Venda):', data.ask);
        console.log('High (Máxima):', data.high);
    } catch (error) {
        console.error(error);
    }
}

checkRates();
