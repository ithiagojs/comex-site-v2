import axios from 'axios';

/**
 * Product Service - Integração com API do Mercado Livre
 * Busca produtos reais (Drones e Smartphones) com fotos e preços
 */

const MERCADO_LIVRE_API = 'https://api.mercadolibre.com/sites/MLB/search';

const searchQueries = {
    drone: 'drone DJI',
    smartphone: 'smartphone Xiaomi Redmi'
};

/**
 * Busca produtos no Mercado Livre por categoria
 * @param {string} category - 'drone' ou 'smartphone'
 * @returns {Promise<Array>}
 */
export async function searchProducts(category) {
    // Retorna diretamente a lista curada de produtos (Drones e Smartphones)
    // conforme solicitado, para garantir preços e pesos fixos e reais de 2026.
    return getMockProducts(category);
}

/**
 * Produtos mock para fallback
 */
function getMockProducts(category) {
    const standardizedCategory = category.toLowerCase().trim();

    // Handle specific variations
    if (standardizedCategory === 'drone' || standardizedCategory === 'drones') {
        return [
            {
                id: 'mock-drone-1',
                title: 'Drone DJI Tello Boost Combo',
                price: 1699.00,
                currency: 'BRL',
                explicitFobUSD: 55.00,
                explicitSellBRL: 1699.00,
                estimatedWeight: 0.25,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Tello+Boost',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-2',
                title: 'Drone DJI Mini 2 SE',
                price: 3500.00,
                currency: 'BRL',
                explicitFobUSD: 115.00,
                explicitSellBRL: 3500.00,
                estimatedWeight: 0.25,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mini+2+SE',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-3',
                title: 'Drone DJI Mini 4 Pro (Fly More Combo c/ Tela)',
                price: 7390.00,
                currency: 'BRL',
                explicitFobUSD: 242.00,
                explicitSellBRL: 7390.00,
                estimatedWeight: 0.90,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mini+4+Pro',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-4',
                title: 'Drone DJI Avata 2 (Combo 1 bateria)',
                price: 9997.00,
                currency: 'BRL',
                explicitFobUSD: 328.00,
                explicitSellBRL: 9997.00,
                estimatedWeight: 0.55,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Avata+2',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-5',
                title: 'Drone DJI Air 3 (Fly More Combo)',
                price: 9025.00,
                currency: 'BRL',
                explicitFobUSD: 296.00,
                explicitSellBRL: 9025.00,
                estimatedWeight: 1.20,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Air+3',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-6',
                title: 'Drone DJI Mavic 3 Classic (Controle RC)',
                price: 20880.00,
                currency: 'BRL',
                explicitFobUSD: 685.00,
                explicitSellBRL: 20880.00,
                estimatedWeight: 1.35,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mavic+3+Classic',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-7',
                title: 'Drone DJI Mavic 3 Enterprise',
                price: 25000.00,
                currency: 'BRL',
                explicitFobUSD: 820.00,
                explicitSellBRL: 25000.00,
                estimatedWeight: 1.60,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mavic+3+Enterprise',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-8',
                title: 'Drone DJI Mavic 3 Thermal',
                price: 38270.00,
                currency: 'BRL',
                explicitFobUSD: 1255.00,
                explicitSellBRL: 38270.00,
                estimatedWeight: 1.60,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mavic+3+Thermal',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-9',
                title: 'Drone DJI Agras T25',
                price: 88690.00,
                currency: 'BRL',
                explicitFobUSD: 2910.00,
                explicitSellBRL: 88690.00,
                estimatedWeight: 25.0,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Agras+T25',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            },
            {
                id: 'mock-drone-10',
                title: 'Drone DJI Inspire 3',
                price: 169000.00,
                currency: 'BRL',
                explicitFobUSD: 5545.00,
                explicitSellBRL: 169000.00,
                estimatedWeight: 5.0,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Inspire+3',
                condition: 'new',
                permalink: '#',
                category: 'drone'
            }
        ];
    } else {
        // Fallback or exact match for 'smartphone'/'smartphones'
        return [
            {
                id: 'mock-phone-1',
                title: 'Xiaomi Redmi 13C (256GB)',
                price: 880.00,
                currency: 'BRL',
                explicitFobUSD: 26.00,
                explicitSellBRL: 880.00,
                estimatedWeight: 0.195,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Redmi+13C',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-2',
                title: 'Xiaomi Poco M6 Pro',
                price: 1664.00,
                currency: 'BRL',
                explicitFobUSD: 49.00,
                explicitSellBRL: 1664.00,
                estimatedWeight: 0.200,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Poco+M6+Pro',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-3',
                title: 'Xiaomi Redmi Note 14 5G',
                price: 1500.00,
                currency: 'BRL',
                explicitFobUSD: 44.00,
                explicitSellBRL: 1500.00,
                estimatedWeight: 0.197,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Note+14+5G',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-4',
                title: 'Xiaomi Poco X6 Pro 5G',
                price: 3404.00,
                currency: 'BRL',
                explicitFobUSD: 100.00,
                explicitSellBRL: 3404.00,
                estimatedWeight: 0.210,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Poco+X6+Pro',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-5',
                title: 'Xiaomi Redmi Note 14 Pro 5G',
                price: 1699.00,
                currency: 'BRL',
                explicitFobUSD: 50.00,
                explicitSellBRL: 1699.00,
                estimatedWeight: 0.205,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Note+14+Pro',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-6',
                title: 'Xiaomi Redmi Note 14 Pro+ 5G',
                price: 2599.00,
                currency: 'BRL',
                explicitFobUSD: 76.00,
                explicitSellBRL: 2599.00,
                estimatedWeight: 0.205,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Note+14+Pro+Plus',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-7',
                title: 'Xiaomi 14T (512GB)',
                price: 3255.00,
                currency: 'BRL',
                explicitFobUSD: 96.00,
                explicitSellBRL: 3255.00,
                estimatedWeight: 0.215,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Xiaomi+14T',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-8',
                title: 'Xiaomi Poco F7',
                price: 3099.00,
                currency: 'BRL',
                explicitFobUSD: 91.00,
                explicitSellBRL: 3099.00,
                estimatedWeight: 0.210,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Poco+F7',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-9',
                title: 'Xiaomi 14T Pro',
                price: 5409.00,
                currency: 'BRL',
                explicitFobUSD: 159.00,
                explicitSellBRL: 5409.00,
                estimatedWeight: 0.220,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=14T+Pro',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            },
            {
                id: 'mock-phone-10',
                title: 'Xiaomi 14 (Flagship)',
                price: 5900.00,
                currency: 'BRL',
                explicitFobUSD: 173.00,
                explicitSellBRL: 5900.00,
                estimatedWeight: 0.188,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Xiaomi+14',
                condition: 'new',
                permalink: '#',
                category: 'smartphone'
            }
        ];
    }
}
