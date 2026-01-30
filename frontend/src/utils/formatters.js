/**
 * Utilitários de Formatação - Padrão Brasileiro
 * Funções para formatar valores monetários e numéricos
 */

/**
 * Formata valor em Reais (BRL)
 * @param {number} value - Valor numérico
 * @returns {string} Valor formatado como "1.234,56"
 */
export function formatBRL(value) {
    if (value === null || value === undefined || isNaN(value)) return '0,00';

    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Formata valor em Dólares (USD)
 * @param {number} value - Valor numérico
 * @returns {string} Valor formatado como "1,234.56"
 */
export function formatUSD(value) {
    if (value === null || value === undefined || isNaN(value)) return '0.00';

    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Formata peso em quilogramas
 * @param {number} value - Valor numérico
 * @param {number} decimals - Número de casas decimais (padrão: 3)
 * @returns {string} Valor formatado como "1,234"
 */
export function formatWeight(value, decimals = 3) {
    if (value === null || value === undefined || isNaN(value)) return '0,000';

    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * Formata percentual
 * @param {number} value - Valor numérico (já em formato percentual, ex: 45.5)
 * @param {number} decimals - Número de casas decimais (padrão: 1)
 * @returns {string} Valor formatado como "45,5%"
 */
export function formatPercent(value, decimals = 1) {
    if (value === null || value === undefined || isNaN(value)) return '0,0%';

    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }) + '%';
}

/**
 * Formata número genérico (sem símbolo monetário)
 * @param {number} value - Valor numérico
 * @param {number} decimals - Número de casas decimais (padrão: 2)
 * @returns {string} Valor formatado como "1.234,56"
 */
export function formatNumber(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return '0,00';

    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}
