import express from 'express';
import cors from 'cors';
import { getExchangeRateHandler, calculateFOBHandler, exportCSVHandler } from './controllers/calculationController.js';
import { getProducts } from './controllers/productController.js';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/exchange-rate', getExchangeRateHandler);
app.get('/api/products/:category', getProducts);
app.post('/api/calculate-fob', calculateFOBHandler);
app.post('/api/export-csv', exportCSVHandler);

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
