import express from 'express';
import cors from 'cors';
import { Parser } from 'json2csv';
import { getExchangeRate } from './services/exchangeService.js';
import { searchProducts } from './services/productService.js';
import { calculateBulkFOB } from './services/calculationService.js';
import { defaultShipmentData } from './data/ncmDatabase.js';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * GET /api/exchange-rate
 * Retorna cotação atual do USD
 */
app.get('/api/exchange-rate', async (req, res) => {
    try {
        const exchangeData = await getExchangeRate();
        res.json(exchangeData);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar cotação',
            message: error.message
        });
    }
});

/**
 * GET /api/products/:category
 * Busca produtos por categoria (drone ou smartphone)
 */
app.get('/api/products/:category', async (req, res) => {
    try {
        const { category } = req.params;

        if (!['drone', 'smartphone'].includes(category.toLowerCase())) {
            return res.status(400).json({
                error: 'Categoria inválida. Use "drone" ou "smartphone"'
            });
        }

        const products = await searchProducts(category);
        res.json(products);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar produtos',
            message: error.message
        });
    }
});

/**
 * POST /api/calculate-fob
 * Calcula FOB para múltiplos produtos
 * Body: { products: [...], exchangeRate: 5.50 }
 */
app.post('/api/calculate-fob', async (req, res) => {
    try {
        const { products, exchangeRate } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({
                error: 'Campo "products" é obrigatório e deve ser um array'
            });
        }

        if (!exchangeRate || exchangeRate <= 0) {
            return res.status(400).json({
                error: 'Campo "exchangeRate" é obrigatório e deve ser maior que zero'
            });
        }

        const calculations = calculateBulkFOB(products, exchangeRate);
        res.json(calculations);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao calcular FOB',
            message: error.message
        });
    }
});

/**
 * POST /api/export-csv
 * Gera CSV no formato Siscomex
 * Body: { products: [...calculatedProducts] }
 */
app.post('/api/export-csv', async (req, res) => {
    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({
                error: 'Campo "products" é obrigatório e deve ser um array'
            });
        }

        // Formata dados para o CSV (formato Siscomex)
        const csvData = products.map(p => ({
            CO_NCM: p.ncmCode,
            Produto: p.title,
            Valor_FOB_USD: p.fobValueUSD.toFixed(2),
            Peso_KG: p.estimatedWeight.toFixed(3),
            Porto_Entrada: defaultShipmentData.porto,
            Pais_Origem: defaultShipmentData.pais
        }));

        // Gera CSV
        const fields = ['CO_NCM', 'Produto', 'Valor_FOB_USD', 'Peso_KG', 'Porto_Entrada', 'Pais_Origem'];
        const parser = new Parser({ fields, delimiter: ';' });
        const csv = parser.parse(csvData);

        // Envia como download
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename=importacao_siscomex.csv');
        res.send('\uFEFF' + csv); // BOM para UTF-8
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao gerar CSV',
            message: error.message
        });
    }
});

/**
 * GET /
 * Health check
 */
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: 'Comex.io Backend',
        version: '1.0.0',
        endpoints: [
            'GET /api/exchange-rate',
            'GET /api/products/:category',
            'POST /api/calculate-fob',
            'POST /api/export-csv'
        ]
    });
});

// Start server


// Start server only if run directly (not imported as module for Vercel)
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => {
        console.log(`\n🚢 Comex.io Backend rodando em http://localhost:${PORT}`);
        console.log(`📡 APIs disponíveis:`);
        console.log(`   - GET  /api/exchange-rate`);
        console.log(`   - GET  /api/products/:category`);
        console.log(`   - POST /api/calculate-fob`);
        console.log(`   - POST /api/export-csv\n`);
    });
}

export default app;
