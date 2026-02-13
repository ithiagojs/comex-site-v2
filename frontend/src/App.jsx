import { useState, useEffect } from 'react';
import './App.css';
import './TabStyles.css';

import { api } from './services/api';
import Analytics from './components/Analytics';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import SocialWidget from './components/SocialWidget';
import Header from './components/Header';
import ProductList from './components/ProductList';
import AuditTable from './components/AuditTable';

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
                <SocialWidget />

                <Header exchangeRate={exchangeRate} />

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
                        <ProductList
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            products={products}
                            loading={loading}
                            auditData={auditData}
                            exchangeRate={exchangeRate}
                            onAnalyze={handleAnalyzeProduct}
                            onRemove={handleRemoveAuditItem}
                        />

                        <AuditTable
                            auditData={auditData}
                            onRemove={handleRemoveAuditItem}
                            onExport={handleExportCSV}
                        />

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
