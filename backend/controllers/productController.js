import { searchProducts } from '../services/productService.js';

export const getProducts = async (req, res) => {
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
};
