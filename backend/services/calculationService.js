import { getNCMData } from '../data/ncmDatabase.js';

/**
 * Calculation Service - Engenharia Reversa para calcular Valor FOB
 * 
 * LÓGICA:
 * 1. Preço de Venda (BRL) no Mercado Livre
 * 2. Remove margem de lucro estimada do vendedor
 * 3. Remove impostos brasileiros (II, IPI, ICMS, PIS/COFINS)
 * 4. Converte para USD usando cotação atual
 * 5. Resultado = FOB Estimado (preço pago na fábrica na China)
 */

/**
 * Calcula o Valor FOB usando engenharia reversa
 * @param {number} sellPrice - Preço de venda no Brasil (BRL)
 * @param {string} category - Categoria do produto
 * @param {number} exchangeRate - Cotação USD/BRL
 * @returns {Object} Cálculo detalhado
 */
export function calculateFOB(sellPrice, category, exchangeRate) {
    const ncmData = getNCMData(category);

    // Passo 1: Remove margem de lucro
    const priceWithoutMargin = sellPrice / (1 + ncmData.estimatedMargin);

    // Passo 2: Calcula base sem ICMS (ICMS é por dentro)
    const baseWithoutICMS = priceWithoutMargin / (1 + ncmData.taxRate.icms);

    // Passo 3: Remove PIS e COFINS
    const baseWithoutPISCOFINS = baseWithoutICMS / (1 + ncmData.taxRate.pis + ncmData.taxRate.cofins);

    // Passo 4: Remove IPI
    const baseWithoutIPI = baseWithoutPISCOFINS / (1 + ncmData.taxRate.ipi);

    // Passo 5: Remove II (Imposto de Importação)
    const baseWithoutII = baseWithoutIPI / (1 + ncmData.taxRate.ii);

    // Passo 6: Converte para USD
    const fobUSD = baseWithoutII / exchangeRate;

    return {
        sellPrice: sellPrice,
        currency: 'BRL',

        // Breakdown da engenharia reversa
        breakdown: {
            priceWithoutMargin: priceWithoutMargin.toFixed(2),
            marginPercent: (ncmData.estimatedMargin * 100).toFixed(0) + '%',

            baseWithoutICMS: baseWithoutICMS.toFixed(2),
            icmsPercent: (ncmData.taxRate.icms * 100).toFixed(0) + '%',

            baseWithoutPISCOFINS: baseWithoutPISCOFINS.toFixed(2),
            pisCofinsPercent: ((ncmData.taxRate.pis + ncmData.taxRate.cofins) * 100).toFixed(2) + '%',

            baseWithoutIPI: baseWithoutIPI.toFixed(2),
            ipiPercent: (ncmData.taxRate.ipi * 100).toFixed(0) + '%',

            baseWithoutII: baseWithoutII.toFixed(2),
            iiPercent: (ncmData.taxRate.ii * 100).toFixed(0) + '%',
        },

        // Resultado final
        fobValueUSD: parseFloat(fobUSD.toFixed(2)),
        exchangeRate: exchangeRate,

        // Dados NCM
        ncmCode: ncmData.code,
        ncmDescription: ncmData.description,
        estimatedWeight: ncmData.defaultWeight
    };
}

/**
 * CÁLCULO CORRETO DE IMPOSTOS EM CASCATA
 * Calcula impostos de importação brasileiros na ordem correta
 * @param {number} fobBRL - Valor FOB em Reais
 * @param {string} category - Categoria do produto
 * @returns {Object} Breakdown completo dos impostos e custo total
 */
export function calculateImportTaxesCascade(fobBRL, category) {
    const ncmData = getNCMData(category);

    // 1. II (Imposto de Importação) - 16%
    const baseII = fobBRL;
    const valueII = baseII * ncmData.taxRate.ii;

    // 2. IPI - 12% (drones) ou 15% (smartphones)
    // Incide sobre FOB + II
    const baseIPI = baseII + valueII;
    const valueIPI = baseIPI * ncmData.taxRate.ipi;

    // 3. PIS/COFINS - 9.25% (1.65% + 7.6%)
    // Incidem sobre FOB + II + IPI
    const basePisCofins = baseIPI + valueIPI;
    const valuePisCofins = basePisCofins * (ncmData.taxRate.pis + ncmData.taxRate.cofins);

    // 4. ICMS - 18% (por dentro)
    // Incide sobre o valor final
    const baseBeforeICMS = basePisCofins + valuePisCofins;
    const valueICMS = (baseBeforeICMS / (1 - ncmData.taxRate.icms)) - baseBeforeICMS;

    // Totais
    const totalTaxes = valueII + valueIPI + valuePisCofins + valueICMS;
    const totalCost = baseBeforeICMS + valueICMS;

    return {
        fobBRL: fobBRL,
        taxes: {
            ii: valueII,
            ipi: valueIPI,
            pisCofins: valuePisCofins,
            icms: valueICMS,
            total: totalTaxes
        },
        totalCost: totalCost,
        effectiveTaxRate: ((totalCost - fobBRL) / fobBRL * 100).toFixed(2) + '%',
        // Breakdown formatado para compatibilidade com código existente
        breakdown: {
            priceWithoutMargin: '0.00',
            marginPercent: 'N/A (Calculado)',
            baseWithoutICMS: baseBeforeICMS.toFixed(2),
            icmsPercent: (ncmData.taxRate.icms * 100).toFixed(0) + '%',
            baseWithoutPISCOFINS: basePisCofins.toFixed(2),
            pisCofinsPercent: ((ncmData.taxRate.pis + ncmData.taxRate.cofins) * 100).toFixed(2) + '%',
            baseWithoutIPI: baseIPI.toFixed(2),
            ipiPercent: (ncmData.taxRate.ipi * 100).toFixed(0) + '%',
            baseWithoutII: baseII.toFixed(2),
            iiPercent: (ncmData.taxRate.ii * 100).toFixed(0) + '%',
        }
    };
}


/**
 * CÁLCULO DIRETO (Forward Calculation)
 * Usado quando temos Valor FOB fixo e Preço de Venda fixo.
 * O objetivo é encontrar a MARGEM resultante.
 */
function calculateForwardMargin(product, exchangeRate) {
    const { explicitFobUSD, explicitSellBRL, category } = product;
    const ncmData = getNCMData(category);

    const fobBRL = explicitFobUSD * exchangeRate;

    // Usa o cálculo correto de impostos em cascata
    const taxCalc = calculateImportTaxesCascade(fobBRL, category);

    return {
        sellPrice: explicitSellBRL,
        currency: 'BRL',
        fobValueUSD: explicitFobUSD,
        exchangeRate: exchangeRate,

        // Dados NCM
        ncmCode: ncmData.code,
        ncmDescription: ncmData.description,
        estimatedWeight: product.estimatedWeight || ncmData.defaultWeight,

        // Usa o breakdown correto da função de cascata
        breakdown: taxCalc.breakdown,

        // Adiciona informações de impostos para uso no frontend
        totalCost: taxCalc.totalCost,
        totalTaxes: taxCalc.taxes.total,
        effectiveTaxRate: taxCalc.effectiveTaxRate
    };
}

/**
 * Processa múltiplos produtos
 */
export function calculateBulkFOB(products, exchangeRate) {
    return products.map(product => {
        // Se houver preços explícitos (Smartphones corrigidos), usa Forward Calculation
        if (product.explicitFobUSD && product.explicitSellBRL) {
            return {
                ...product,
                ...calculateForwardMargin(product, exchangeRate)
            };
        }

        // Caso contrário (Drones antigos), usa Engenharia Reversa padrão
        const calculation = calculateFOB(product.price, product.category, exchangeRate);

        return {
            ...product,
            ...calculation,
            // Preserva o peso real do produto em vez de usar o defaultWeight do NCM
            estimatedWeight: product.estimatedWeight || calculation.estimatedWeight
        };
    });
}
