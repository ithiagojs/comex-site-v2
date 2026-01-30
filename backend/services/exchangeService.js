import axios from 'axios';

/**
 * Exchange Service - Integração com APIs Gratuitas
 * Busca cotação do Dólar (USD) para Real (BRL)
 */

const API_PROVIDERS = [
    {
        name: 'AwesomeAPI',
        url: 'https://economia.awesomeapi.com.br/json/last/USD-BRL',
        handler: (data) => ({
            // Usamos 'ask' (Venda) pois é o valor pago para comprar dólares para importação
            rate: parseFloat(data.USDBRL.ask),
            timestamp: new Date(parseInt(data.USDBRL.timestamp) * 1000).toISOString(),
            source: 'AwesomeAPI'
        })
    },
    {
        name: 'OpenEra',
        url: 'https://open.er-api.com/v6/latest/USD',
        handler: (data) => ({
            rate: data.rates.BRL,
            timestamp: new Date(data.time_last_update_unix * 1000).toISOString(),
            source: 'OpenEra API'
        })
    }
];

const FALLBACK_RATE = 5.80; // Atualizado para um valor mais realista de mercado (margem de segurança)

export async function getExchangeRate() {
    // Tenta cada provedor em ordem
    for (const provider of API_PROVIDERS) {
        try {
            console.log(`Trying fetching rate from ${provider.name}...`);
            const response = await axios.get(provider.url, { timeout: 5000 });

            const result = provider.handler(response.data);

            // Validação básica
            if (!result.rate || isNaN(result.rate)) {
                throw new Error('Invalid rate data');
            }

            return {
                ...result,
                low: result.rate * 0.99,
                high: result.rate * 1.01
            };
        } catch (error) {
            console.warn(`Failed to fetch from ${provider.name}:`, error.message);
            // Continua para o próximo provedor
        }
    }

    // Se todos falharem
    console.warn('All APIs failed. Using fallback rate.');
    return {
        rate: FALLBACK_RATE,
        timestamp: new Date().toISOString(),
        source: 'Fallback (System)',
        high: FALLBACK_RATE,
        low: FALLBACK_RATE,
        error: 'Service Unavailable'
    };
}
