import { getNCMData } from './data/ncmDatabase.js';
import { getExchangeRate } from './services/exchangeService.js';

/**
 * Script de Teste - Demonstra os erros nos cálculos de margem
 */

// Função CORRETA para calcular impostos em cascata
function calculateImportTaxesCascade(fobBRL, category) {
    const ncmData = getNCMData(category);

    // 1. II (Imposto de Importação)
    const baseII = fobBRL;
    const valueII = baseII * ncmData.taxRate.ii;

    // 2. IPI (incide sobre FOB + II)
    const baseIPI = baseII + valueII;
    const valueIPI = baseIPI * ncmData.taxRate.ipi;

    // 3. PIS/COFINS (incidem sobre FOB + II + IPI)
    const basePisCofins = baseIPI + valueIPI;
    const valuePisCofins = basePisCofins * (ncmData.taxRate.pis + ncmData.taxRate.cofins);

    // 4. ICMS (por dentro - incide sobre o valor final)
    const baseBeforeICMS = basePisCofins + valuePisCofins;
    const valueICMS = (baseBeforeICMS / (1 - ncmData.taxRate.icms)) - baseBeforeICMS;

    const totalCost = baseBeforeICMS + valueICMS;

    return {
        fobBRL,
        ii: valueII,
        ipi: valueIPI,
        pisCofins: valuePisCofins,
        icms: valueICMS,
        totalTaxes: valueII + valueIPI + valuePisCofins + valueICMS,
        totalCost,
        effectiveTaxRate: ((totalCost - fobBRL) / fobBRL * 100).toFixed(2) + '%'
    };
}

// Função ERRADA (atual do sistema)
function calculateMarginWrong(sellPrice, fobBRL) {
    return ((sellPrice - fobBRL) / sellPrice * 100).toFixed(1);
}

// Função CORRETA
function calculateMarginCorrect(sellPrice, totalCost) {
    return ((sellPrice - totalCost) / sellPrice * 100).toFixed(1);
}

// Produtos de teste
const testProducts = [
    {
        name: 'Drone DJI Mini 4 Pro',
        category: 'drone',
        fobUSD: 242.00,
        sellBRL: 7390.00
    },
    {
        name: 'Xiaomi 14T Pro',
        category: 'smartphone',
        fobUSD: 159.00,
        sellBRL: 5409.00
    },
    {
        name: 'Drone DJI Inspire 3',
        category: 'drone',
        fobUSD: 5545.00,
        sellBRL: 169000.00
    }
];

console.log('\n🔍 ANÁLISE DE CÁLCULOS - COMEX.IO\n');
console.log('='.repeat(80));

// Busca cotação atual
const exchangeData = await getExchangeRate();
const rate = exchangeData.rate;

console.log(`\n💵 Cotação USD/BRL: R$ ${rate.toFixed(4)} (${exchangeData.source})`);
console.log('='.repeat(80));

// Testa cada produto
testProducts.forEach((product, index) => {
    console.log(`\n\n📦 PRODUTO ${index + 1}: ${product.name}`);
    console.log('-'.repeat(80));

    const fobBRL = product.fobUSD * rate;
    console.log(`\nFOB: $${product.fobUSD.toFixed(2)} × R$ ${rate.toFixed(2)} = R$ ${fobBRL.toFixed(2)}`);
    console.log(`Preço de Venda: R$ ${product.sellBRL.toFixed(2)}`);

    // Calcula impostos corretamente
    const taxes = calculateImportTaxesCascade(fobBRL, product.category);

    console.log('\n📊 IMPOSTOS EM CASCATA:');
    console.log(`   II (16%):           R$ ${taxes.ii.toFixed(2)}`);
    console.log(`   IPI (${product.category === 'drone' ? '12' : '15'}%):          R$ ${taxes.ipi.toFixed(2)}`);
    console.log(`   PIS/COFINS (9.25%): R$ ${taxes.pisCofins.toFixed(2)}`);
    console.log(`   ICMS (18%):         R$ ${taxes.icms.toFixed(2)}`);
    console.log(`   ─────────────────────────────────`);
    console.log(`   TOTAL IMPOSTOS:     R$ ${taxes.totalTaxes.toFixed(2)}`);
    console.log(`   CUSTO TOTAL:        R$ ${taxes.totalCost.toFixed(2)}`);
    console.log(`   Taxa Efetiva:       ${taxes.effectiveTaxRate}`);

    // Compara cálculos
    const marginWrong = calculateMarginWrong(product.sellBRL, fobBRL);
    const marginCorrect = calculateMarginCorrect(product.sellBRL, taxes.totalCost);

    console.log('\n⚖️  COMPARAÇÃO DE MARGENS:');
    console.log(`   ❌ CÁLCULO ATUAL (ERRADO):  ${marginWrong}%`);
    console.log(`      (ignora R$ ${taxes.totalTaxes.toFixed(2)} em impostos!)`);
    console.log(`   ✅ CÁLCULO CORRETO:         ${marginCorrect}%`);
    console.log(`      Diferença: ${(parseFloat(marginWrong) - parseFloat(marginCorrect)).toFixed(1)} pontos percentuais`);

    // Calcula lucro real
    const profit = product.sellBRL - taxes.totalCost;
    const profitMargin = (profit / taxes.totalCost * 100).toFixed(1);

    console.log('\n💰 LUCRO REAL:');
    console.log(`   Valor: R$ ${profit.toFixed(2)}`);
    console.log(`   Margem sobre Custo: ${profitMargin}%`);
});

console.log('\n\n' + '='.repeat(80));
console.log('🎯 CONCLUSÃO:');
console.log('='.repeat(80));
console.log('\nO cálculo atual SUPERESTIMA as margens porque ignora os impostos de importação.');
console.log('Isso pode levar a decisões de precificação INCORRETAS!\n');
console.log('Recomendação: Implementar cálculo de impostos em cascata conforme demonstrado.\n');
