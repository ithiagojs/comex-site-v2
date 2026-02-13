import { Parser } from 'json2csv';
import { getExchangeRate } from '../services/exchangeService.js';
import { calculateBulkFOB } from '../services/calculationService.js';
import { defaultShipmentData } from '../data/ncmDatabase.js';

export const getExchangeRateHandler = async (req, res) => {
    try {
        const exchangeData = await getExchangeRate();
        res.json(exchangeData);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar cotação',
            message: error.message
        });
    }
};

export const calculateFOBHandler = async (req, res) => {
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
};

export const exportCSVHandler = async (req, res) => {
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
};
