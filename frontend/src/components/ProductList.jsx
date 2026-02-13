import React from 'react';
import { formatBRL } from '../utils/formatters';

const ProductList = ({
    selectedCategory,
    setSelectedCategory,
    products,
    loading,
    auditData,
    exchangeRate,
    onAnalyze,
    onRemove
}) => {
    return (
        <>
            {/* Category Selector */}
            <div className="category-selector">
                <button
                    className={`category-btn ${selectedCategory === 'drone' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('drone')}
                >
                    🛸 Drones
                </button>
                <button
                    className={`category-btn ${selectedCategory === 'smartphone' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('smartphone')}
                >
                    📱 Smartphones
                </button>
            </div>

            {/* Products Section */}
            <section className="products-section">
                <h2 className="section-title">
                    Produtos Disponíveis ({selectedCategory === 'drone' ? 'Drones' : 'Smartphones'})
                </h2>

                {loading ? (
                    <div className="loading">Carregando produtos...</div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => {
                            const isSelected = auditData.some(item => item.id === product.id);
                            return (
                                <div
                                    key={product.id}
                                    className={`product-card ${isSelected ? 'selected' : ''}`}
                                >
                                    <div className="product-image">
                                        {product.title.split(' ').slice(0, 3).join(' ')}
                                        {product.description && (
                                            <div className="product-overlay">
                                                <p>{product.description}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-title">{product.title}</h3>
                                        <p className="product-price">
                                            {product.currency === 'USD' && exchangeRate
                                                ? `R$ ${formatBRL(product.price * exchangeRate.rate)}`
                                                : `R$ ${formatBRL(product.price)}`
                                            }
                                        </p>
                                        <button
                                            className={`analyze-btn ${isSelected ? 'selected' : ''}`}
                                            onClick={() => isSelected ? onRemove(product.id) : onAnalyze(product)}
                                        >
                                            {isSelected ? '✓ Selecionado' : '🔍 Analisar Importação'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </>
    );
};

export default ProductList;
