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
                title: 'DJI Tello Boost Combo',
                price: 699.00,
                currency: 'BRL',
                explicitFobUSD: 55.00,
                explicitSellBRL: 699.00,
                estimatedWeight: 0.25,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Tello+Boost',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone compacto para iniciantes, com vídeo HD e controle fácil via app.'
            },
            {
                id: 'mock-drone-2',
                title: 'DJI Mini 2 SE',
                price: 3400.00,
                currency: 'BRL',
                explicitFobUSD: 115.00,
                explicitSellBRL: 3400.00,
                estimatedWeight: 0.25,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mini+2+SE',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone leve, 4K, perfeito para criadores de conteúdo e iniciantes.'
            },
            {
                id: 'mock-drone-3',
                title: 'DJI Mini 4 Pro (Fly More)',
                price: 9300.00,
                currency: 'BRL',
                explicitFobUSD: 242.00,
                explicitSellBRL: 9300.00,
                estimatedWeight: 0.90,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mini+4+Pro',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone profissional compacto com sensores omnidirecionais e 4K/60fps.'
            },
            {
                id: 'mock-drone-4',
                title: 'DJI Avata 2 (Combo 1 bat)',
                price: 10699.00,
                currency: 'BRL',
                explicitFobUSD: 328.00,
                explicitSellBRL: 10699.00,
                estimatedWeight: 0.55,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Avata+2',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone FPV para filmagens imersivas, com alta estabilidade e controle preciso.'
            },
            {
                id: 'mock-drone-5',
                title: 'DJI Air 3 (Fly More)',
                price: 15900.00,
                currency: 'BRL',
                explicitFobUSD: 296.00,
                explicitSellBRL: 15900.00,
                estimatedWeight: 1.20,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Air+3',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone versátil com câmera dupla e transmissão de longa distância.'
            },
            {
                id: 'mock-drone-6',
                title: 'DJI Mavic 3 Classic',
                price: 30990.00,
                currency: 'BRL',
                explicitFobUSD: 685.00,
                explicitSellBRL: 30990.00,
                estimatedWeight: 1.35,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mavic+3+Classic',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone profissional com câmeras avançadas e excelente autonomia de voo.'
            },
            {
                id: 'mock-drone-7',
                title: 'DJI Mavic 3 Enterprise',
                price: 37990.00,
                currency: 'BRL',
                explicitFobUSD: 820.00,
                explicitSellBRL: 37990.00,
                estimatedWeight: 1.60,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mavic+3+Enterprise',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Ideal para inspeções e mapeamentos, com tecnologias de ponta.'
            },
            {
                id: 'mock-drone-8',
                title: 'DJI Mavic 3 Thermal',
                price: 80000.00,
                currency: 'BRL',
                explicitFobUSD: 1255.00,
                explicitSellBRL: 80000.00,
                estimatedWeight: 1.60,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Mavic+3+Thermal',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone térmico para uso profissional em segurança e inspeções industriais.'
            },
            {
                id: 'mock-drone-9',
                title: 'DJI Agras T25',
                price: 90000.00,
                currency: 'BRL',
                explicitFobUSD: 2910.00,
                explicitSellBRL: 90000.00,
                estimatedWeight: 25.0,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Agras+T25',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone agrícola para pulverização, com alta capacidade de carga e precisão.'
            },
            {
                id: 'mock-drone-10',
                title: 'DJI Inspire 3',
                price: 149000.00,
                currency: 'BRL',
                explicitFobUSD: 5545.00,
                explicitSellBRL: 149000.00,
                estimatedWeight: 5.0,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/ef4444&text=Inspire+3',
                condition: 'new',
                permalink: '#',
                category: 'drone',
                description: 'Drone cinematográfico avançado com câmeras de cinema e precisão excepcional.'
            }
        ];
    } else {
        // Fallback or exact match for 'smartphone'/'smartphones'
        return [
            {
                id: 'mock-phone-1',
                title: 'Redmi 13C (256GB)',
                price: 1349.00,
                currency: 'BRL',
                explicitFobUSD: 26.00,
                explicitSellBRL: 1349.00,
                estimatedWeight: 0.195,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Redmi+13C',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Smartphone básico com 5G, ideal para uso diário e redes sociais.'
            },
            {
                id: 'mock-phone-2',
                title: 'Poco M6 Pro',
                price: 1500.00,
                currency: 'BRL',
                explicitFobUSD: 49.00,
                explicitSellBRL: 1500.00,
                estimatedWeight: 0.200,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Poco+M6+Pro',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Celular intermediário com ótimo desempenho e tela fluída.'
            },
            {
                id: 'mock-phone-3',
                title: 'Redmi Note 14 5G',
                price: 1700.00,
                currency: 'BRL',
                explicitFobUSD: 44.00,
                explicitSellBRL: 1700.00,
                estimatedWeight: 0.197,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Note+14+5G',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Smartphone 5G com bom custo-benefício e câmeras eficientes.'
            },
            {
                id: 'mock-phone-4',
                title: 'Poco X6 Pro 5G',
                price: 2900.00,
                currency: 'BRL',
                explicitFobUSD: 100.00,
                explicitSellBRL: 2900.00,
                estimatedWeight: 0.210,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Poco+X6+Pro',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Dispositivo focado em desempenho para jogos e multitarefas.'
            },
            {
                id: 'mock-phone-5',
                title: 'Redmi Note 14 Pro 5G',
                price: 2300.00,
                currency: 'BRL',
                explicitFobUSD: 50.00,
                explicitSellBRL: 2300.00,
                estimatedWeight: 0.205,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Note+14+Pro',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Smartphone de alta performance com câmeras poderosas e 5G.'
            },
            {
                id: 'mock-phone-6',
                title: 'Redmi Note 14 Pro+ 5G',
                price: 3000.00,
                currency: 'BRL',
                explicitFobUSD: 76.00,
                explicitSellBRL: 3000.00,
                estimatedWeight: 0.205,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Note+14+Pro+Plus',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Celular premium com display de alta resolução e 5G.'
            },
            {
                id: 'mock-phone-7',
                title: 'Xiaomi 14T (512GB)',
                price: 4500.00,
                currency: 'BRL',
                explicitFobUSD: 96.00,
                explicitSellBRL: 4500.00,
                estimatedWeight: 0.215,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Xiaomi+14T',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Smartphone topo de linha, com desempenho superior e câmeras excepcionais.'
            },
            {
                id: 'mock-phone-8',
                title: 'Poco F7',
                price: 3200.00,
                currency: 'BRL',
                explicitFobUSD: 91.00,
                explicitSellBRL: 3200.00,
                estimatedWeight: 0.210,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Poco+F7',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Focado em performance, com processador rápido e design moderno.'
            },
            {
                id: 'mock-phone-9',
                title: 'Xiaomi 14T Pro',
                price: 5000.00,
                currency: 'BRL',
                explicitFobUSD: 159.00,
                explicitSellBRL: 5000.00,
                estimatedWeight: 0.220,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=14T+Pro',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Versão Pro com display 120Hz e câmera de altíssima resolução.'
            },
            {
                id: 'mock-phone-10',
                title: 'Xiaomi 14 (Flagship)',
                price: 5500.00,
                currency: 'BRL',
                explicitFobUSD: 173.00,
                explicitSellBRL: 5500.00,
                estimatedWeight: 0.188,
                thumbnail: 'https://dummyimage.com/300x300/1a1a2e/3b82f6&text=Xiaomi+14',
                condition: 'new',
                permalink: '#',
                category: 'smartphone',
                description: 'Smartphone premium com design sofisticado e excelente desempenho.'
            }
        ];
    }
}
