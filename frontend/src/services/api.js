import axios from 'axios';

const API_BASE_URL = '/api';

/**
 * API Client para comunicação com o backend
 */

export const api = {
    /**
     * Busca a cotação atual do dólar
     */
    getExchangeRate: async () => {
        const response = await axios.get(`${API_BASE_URL}/exchange-rate`);
        return response.data;
    },

    /**
     * Busca produtos por categoria
     * @param {string} category - 'drone' ou 'smartphone'
     */
    getProducts: async (category) => {
        const response = await axios.get(`${API_BASE_URL}/products/${category}`);
        return response.data;
    },

    /**
     * Calcula FOB para produtos
     * @param {Array} products
     * @param {number} exchangeRate
     */
    calculateFOB: async (products, exchangeRate) => {
        const response = await axios.post(`${API_BASE_URL}/calculate-fob`, {
            products,
            exchangeRate
        });
        return response.data;
    },

    /**
     * Exporta CSV
     * @param {Array} products
     */
    exportCSV: async (products) => {
        const response = await axios.post(`${API_BASE_URL}/export-csv`, {
            products
        }, {
            responseType: 'blob'
        });

        // Cria link de download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'importacao_siscomex.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};
