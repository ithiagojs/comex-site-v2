import { useState, useEffect } from 'react';
import './App.css';
import './TabStyles.css';

import { api } from './services/api';
import Analytics from './components/Analytics';
import MarketTicker from './components/MarketTicker';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import { formatBRL, formatUSD, formatWeight } from './utils/formatters';

function App() {
    const [activeTab, setActiveTab] = useState('products');
    const [selectedCategory, setSelectedCategory] = useState('drone');
    const [products, setProducts] = useState([]);
    const [auditData, setAuditData] = useState([]);
    const [exchangeRate, setExchangeRate] = useState(null);
    const [loading, setLoading] = useState(false);

    // Busca cotação ao carregar
    useEffect(() => {
        fetchExchangeRate();
    }, []);

    // Busca produtos quando categoria muda
    useEffect(() => {
        if (selectedCategory && activeTab === 'products') {
            fetchProducts();
        }
    }, [selectedCategory, activeTab]);

    const fetchExchangeRate = async () => {
        try {
            const data = await api.getExchangeRate();
            setExchangeRate(data);
        } catch (error) {
            console.error('Erro ao buscar cotação:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await api.getProducts(selectedCategory);
            setProducts(data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyzeProduct = async (product) => {
        if (!exchangeRate) return;

        try {
            const calculated = await api.calculateFOB([product], exchangeRate.rate);
            setAuditData(prev => {
                // Evita duplicatas baseadas no ID único do produto
                const existing = prev.find(p => p.id === product.id);
                if (existing) return prev;
                return [...prev, ...calculated];
            });
        } catch (error) {
            console.error('Erro ao calcular FOB:', error);
        }
    };

    const handleRemoveAuditItem = (id) => {
        setAuditData(prev => prev.filter(item => item.id !== id));
    };

    const handleExportCSV = async () => {
        if (auditData.length === 0) {
            alert('Não há dados para exportar. Analise alguns produtos primeiro!');
            return;
        }

        try {
            await api.exportCSV(auditData);
        } catch (error) {
            console.error('Erro ao exportar CSV:', error);
            alert('Erro ao exportar CSV. Verifique o console.');
        }
    };



    return (
        <ThemeProvider>
            <div className="app">
                <ThemeToggle />
                {/* Header */}
                <header className="header">
                    <h1>🚢 Comex.io</h1>
                    <p className="subtitle">Import Hunter</p>

                    {exchangeRate && <MarketTicker data={exchangeRate} />}
                </header>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <button
                        className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                        onClick={() => setActiveTab('products')}
                    >
                        📦 Produtos
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        📊 Analytics
                    </button>
                </div>

                {/* Products Tab */}
                {activeTab === 'products' && (
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
                                                        onClick={() => isSelected ? handleRemoveAuditItem(product.id) : handleAnalyzeProduct(product)}
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

                        {/* Audit Table */}
                        {auditData.length > 0 && (
                            <section className="audit-section">
                                <h2 className="section-title">📋 Tabela de Auditoria - Análise FOB</h2>

                                <div className="audit-container">
                                    <div className="table-wrapper">
                                        <table className="audit-table">
                                            <thead>
                                                <tr>
                                                    <th>Produto</th>
                                                    <th>NCM</th>
                                                    <th>Preço Venda (BRL)</th>
                                                    <th>Valor FOB (USD)</th>
                                                    <th>Peso (kg)</th>
                                                    <th>Porto</th>
                                                    <th>País</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {auditData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.title}</td>
                                                        <td>{item.ncmCode}</td>
                                                        <td>R$ {formatBRL(item.sellPrice)}</td>
                                                        <td style={{ color: '#10b981', fontWeight: '600' }}>
                                                            $ {formatUSD(item.fobValueUSD)}
                                                        </td>
                                                        <td>{formatWeight(item.estimatedWeight)}</td>
                                                        <td>SANTOS</td>
                                                        <td>CHINA</td>
                                                        <td>
                                                            <button
                                                                className="remove-btn"
                                                                onClick={() => handleRemoveAuditItem(item.id)}
                                                                title="Remover item"
                                                            >
                                                                ✕
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <button className="export-btn" onClick={handleExportCSV}>
                                        📥 Exportar CSV para Siscomex
                                    </button>
                                </div>
                            </section>
                        )}

                        {auditData.length === 0 && !loading && (
                            <div className="empty-state">
                                <div className="empty-state-icon">📊</div>
                                <p>Selecione produtos acima e clique em "Analisar Importação" para ver os cálculos detalhados</p>
                            </div>
                        )}
                    </>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <Analytics
                        auditData={auditData}
                        exchangeRate={exchangeRate}
                    />
                )}

            </div>
        </ThemeProvider>
    );
}

export default App;
