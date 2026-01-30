import {
    ScatterChart, Scatter, BarChart, Bar, PieChart, Pie, Cell,
    ComposedChart, Line, Area,
    ReferenceLine, ZAxis, Label, LabelList,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Analytics.css';
import { formatBRL, formatUSD, formatWeight, formatPercent, formatNumber } from '../utils/formatters';

const Analytics = ({ auditData, exchangeRate }) => {
    // Fail-safe for missing data
    if (!auditData || auditData.length === 0) {
        return (
            <div className="analytics-empty">
                <div className="empty-icon">📊</div>
                <h2>Nenhum dado para análise</h2>
                <p>Analise alguns produtos na aba "Produtos" para ver os gráficos</p>
            </div>
        );
    }

    // 1. DATA SANITIZATION (The Firewall) 🛡️
    const rate = Number(exchangeRate?.rate) || 0;

    const safeData = auditData.map(item => {
        const safeFob = Number(item.fobValueUSD) || 0;
        const safePrice = Number(item.sellPrice) || 0;
        const safeWeight = Number(item.estimatedWeight) || 1; // Prevent div by zero
        const safeFobBRL = safeFob * rate;

        return {
            ...item,
            fobValueUSD: safeFob,
            sellPrice: safePrice,
            estimatedWeight: safeWeight,
            fobBRL: safeFobBRL,
            title: String(item.title || 'Produto'),
            category: String(item.category || 'outros')
        };
    });

    // ===== CÁLCULOS =====

    // 1. Scatter Data
    const scatterData = safeData.map(item => {
        const fobBRL = item.fobValueUSD * rate;
        // Usa multiplicador correto baseado na categoria
        const taxMultiplier = item.category === 'drone' ? 1.73 : 1.78;
        const totalCost = fobBRL * taxMultiplier;

        return {
            fullName: item.title,
            name: item.title.split(' ').slice(0, 3).join(' '),
            fobUSD: item.fobValueUSD,
            sellPrice: item.sellPrice,
            category: item.category,
            weight: item.estimatedWeight,
            margin: item.sellPrice > 0
                ? ((item.sellPrice - totalCost) / item.sellPrice * 100).toFixed(1)
                : '0.0'
        };
    });

    // 2. Density Data
    const densityData = safeData
        .map(item => ({
            name: item.title.split(' ').slice(0, 3).join(' '),
            density: (item.sellPrice / item.estimatedWeight).toFixed(2),
            category: item.category
        }))
        .sort((a, b) => Number(b.density) - Number(a.density))
        .slice(0, 12);

    // 3. Cost Breakdown Data
    const calculateCostBreakdown = (category) => {
        const items = safeData.filter(i => i.category === category);
        if (items.length === 0) return [];

        const totalSell = items.reduce((sum, i) => sum + i.sellPrice, 0);
        const totalFobBRL = items.reduce((sum, i) => sum + i.fobBRL, 0);

        const count = items.length;
        const avgSellPrice = totalSell / count;
        const avgFobBRL = totalFobBRL / count;

        // Usa multiplicador correto para calcular impostos reais
        const taxMultiplier = category === 'drone' ? 0.73 : 0.78; // Percentual de impostos
        const taxes = avgFobBRL * taxMultiplier;
        const totalCost = avgFobBRL + taxes;
        const margin = avgSellPrice - totalCost;

        return [
            { name: 'Custo China', value: Math.max(0, Number(avgFobBRL.toFixed(2))), color: '#95A5A6' },
            { name: 'Impostos', value: Math.max(0, Number(taxes.toFixed(2))), color: '#C0392B' },
            { name: 'Margem Bruta', value: Math.max(0, Number(margin.toFixed(2))), color: '#27AE60' }
        ];
    };

    const droneCosts = calculateCostBreakdown('drone');
    const phoneCosts = calculateCostBreakdown('smartphone');

    // 4. KPIs
    const totalRevenue = safeData.reduce((sum, i) => sum + i.sellPrice, 0);
    const totalFobBRL = safeData.reduce((sum, i) => sum + (i.fobValueUSD * rate), 0);

    // Calcula custo total considerando impostos
    const totalCostWithTaxes = safeData.reduce((sum, i) => {
        const fobBRL = i.fobValueUSD * rate;
        const taxMultiplier = i.category === 'drone' ? 1.73 : 1.78;
        return sum + (fobBRL * taxMultiplier);
    }, 0);

    const avgMargin = totalRevenue > 0 ? ((totalRevenue - totalCostWithTaxes) / totalRevenue * 100).toFixed(1) : '0.0';

    const sumDensities = safeData.reduce((sum, i) => sum + (i.sellPrice / i.estimatedWeight), 0);
    const avgDensity = (sumDensities / safeData.length).toFixed(2);

    // Helper for Table


    // Safe Averages for ReferenceLines
    const avgFobGlobal = safeData.reduce((acc, cur) => acc + cur.fobValueUSD, 0) / safeData.length;
    const avgSellGlobal = safeData.reduce((acc, cur) => acc + cur.sellPrice, 0) / safeData.length;

    // 5. Curva ABC (Pareto) Data
    const paretoData = (() => {
        // Agrupa por produto e soma faturamento
        const sorted = [...safeData]
            .sort((a, b) => b.sellPrice - a.sellPrice)
            .slice(0, 12); // Top 12 produtos

        const totalFaturamento = sorted.reduce((sum, item) => sum + item.sellPrice, 0);
        let accumulated = 0;

        return sorted.map(item => {
            accumulated += item.sellPrice;
            return {
                name: item.title.split(' ').slice(0, 2).join(' '),
                fullName: item.title,
                faturamento: item.sellPrice,
                percentAcumulado: totalFaturamento > 0 ? (accumulated / totalFaturamento) * 100 : 0,
                category: item.category
            };
        });
    })();

    return (
        <div className="analytics-container">
            {/* KPIs Header */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon">💰</div>
                    <div className="kpi-content">
                        <h4>Faturamento Total</h4>
                        <p className="kpi-value">R$ {formatBRL(totalRevenue)}</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">📦</div>
                    <div className="kpi-content">
                        <h4>Custo Total</h4>
                        <p className="kpi-value">R$ {formatBRL(totalCostWithTaxes)}</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">📊</div>
                    <div className="kpi-content">
                        <h4>Margem Média</h4>
                        <p className="kpi-value">{formatPercent(Number(avgMargin))}</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon">⚖️</div>
                    <div className="kpi-content">
                        <h4>Densidade Média</h4>
                        <p className="kpi-value">R$ {formatNumber(Number(avgDensity))}/kg</p>
                    </div>
                </div>
            </div>

            {/* Gráfico 1: Scatter */}
            <div className="chart-card">
                <h3 className="chart-title">📈 Matriz de Estratégia: Risco vs. Retorno</h3>
                <p className="chart-subtitle">Custo FOB (Risco de Capital) × Preço de Venda (Retorno)</p>
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart margin={{ top: 30, right: 30, bottom: 30, left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                        <XAxis type="number" dataKey="fobUSD" name="FOB" unit=" USD" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                        <YAxis type="number" dataKey="sellPrice" name="Venda" unit=" BRL" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                        <ZAxis type="number" dataKey="weight" range={[100, 150]} name="Peso (kg)" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend verticalAlign="top" height={36} />

                        <ReferenceLine x={avgFobGlobal} stroke="#6b7280" strokeDasharray="3 3" label="Média FOB" />
                        <ReferenceLine y={avgSellGlobal} stroke="#6b7280" strokeDasharray="3 3" label="Média Venda" />

                        <Scatter name="Drones" data={scatterData.filter(d => d.category === 'drone')} fill="#ef4444" />
                        <Scatter name="Smartphones" data={scatterData.filter(d => d.category === 'smartphone')} fill="#3b82f6" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico 2: Density Analysis */}
            <div className="chart-card">
                <h3 className="chart-title">💎 Ranking de Densidade (Quem paga o Frete Aéreo?)</h3>
                <p className="chart-subtitle">Valor Agregado por Kg (Quanto maior, mais viável o frete Aéreo)</p>
                <ResponsiveContainer width="100%" height={600}>
                    <BarChart data={densityData} layout="vertical" margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            type="number"
                            stroke="#9ca3af"
                            tick={false}
                            axisLine={false}
                            domain={[0, dataMax => Math.max(dataMax, 4000)]}
                        />
                        <YAxis dataKey="name" type="category" stroke="#9ca3af" width={120} tick={{ fontSize: 11 }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="custom-tooltip" style={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px', padding: '10px' }}>
                                            <p className="label" style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>{label}</p>
                                            <p className="value" style={{ color: '#f3f4f6', margin: 0 }}>
                                                {`R$ ${formatBRL(Number(payload[0].value))}/kg`}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend
                            payload={[
                                { value: 'Drones', type: 'square', id: 'ID01', color: '#FFB74D' },
                                { value: 'Smartphones', type: 'square', id: 'ID02', color: '#8AB4F8' }
                            ]}
                            verticalAlign="top"
                            height={36}
                            wrapperStyle={{ color: '#e5e7eb', fontSize: '12px', paddingBottom: '10px' }}
                        />
                        <ReferenceLine
                            x={3000}
                            stroke="#10b981"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            isFront={true}
                        >
                            <Label
                                value="Zona Aérea ✈️"
                                position="insideTopRight"
                                fill="#10b981"
                                fontSize={12}
                                fontWeight={600}
                                dy={-10}
                            />
                            <Label
                                value="Zona Marítima 🚢"
                                position="insideTopLeft"
                                fill="#3b82f6"
                                fontSize={12}
                                fontWeight={600}
                                dy={-10}
                            />
                        </ReferenceLine>
                        <Bar dataKey="density" radius={[0, 4, 4, 0]} barSize={20} legendType="none">
                            {densityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.category === 'drone' ? '#FFB74D' : '#8AB4F8'} />
                            ))}
                            <LabelList
                                dataKey="density"
                                position="right"
                                fill="#ffffff"
                                fontSize={12}
                                fontWeight={600}
                                formatter={(val) => {
                                    const v = Number(val);
                                    if (v >= 1000) {
                                        return `R$ ${formatNumber(v / 1000, 1)}k / kg`;
                                    }
                                    return `R$ ${formatNumber(v, 0)} / kg`;
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico 3: Cost Breakdown */}
            <div className="charts-row">
                <div className="chart-card-half">
                    <h3 className="chart-title">Composição do Preço: Quem ganha mais? (Drones)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={droneCosts}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {droneCosts.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#e5e7eb" fontSize={32}>🛸</text>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card-half">
                    <h3 className="chart-title">Composição do Preço: Quem ganha mais? (Smartphones)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={phoneCosts}
                                cx="50%"
                                cy="50%"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {phoneCosts.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                            </Pie>
                            <text x="50%" y="50%" dy={8} textAnchor="middle" fill="#e5e7eb" fontSize={32}>📱</text>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráfico 4: Curva ABC (Pareto) */}
            <div className="chart-card">
                <h3 className="chart-title">📊 Curva ABC: Quem sustenta o faturamento?</h3>
                <p className="chart-subtitle">Lei de Pareto: Top 12 Produtos por Receita (Barras) + % Acumulado (Linha)</p>
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart data={paretoData} margin={{ top: 20, right: 60, left: 20, bottom: 60 }} barGap={0.2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="name"
                            stroke="#9ca3af"
                            tick={{ fill: '#e5e7eb', fontSize: 10 }}
                            angle={-35}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                            tickFormatter={(value) => {
                                if (value >= 1000) {
                                    return `R$ ${(value / 1000).toFixed(0)}k`;
                                }
                                return `R$ ${value}`;
                            }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#F1C40F"
                            tick={{ fill: '#F1C40F' }}
                            domain={[0, 105]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div style={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '4px', padding: '10px' }}>
                                            <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>{data.fullName}</p>
                                            <p style={{ color: '#3b82f6', margin: '2px 0' }}>Faturamento: R$ {formatBRL(data.faturamento)}</p>
                                            <p style={{ color: '#F1C40F', margin: '2px 0' }}>% Acumulado: {data.percentAcumulado.toFixed(1)}%</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend
                            payload={[
                                { value: 'Faturamento (BRL)', type: 'square', color: '#2C3E50' },
                                { value: '% Acumulado', type: 'line', color: '#F1C40F' }
                            ]}
                            verticalAlign="top"
                            height={36}
                            wrapperStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                        />

                        {/* Linha de corte 80% - Classe A */}
                        <ReferenceLine
                            yAxisId="right"
                            y={80}
                            stroke="#E74C3C"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                        >
                            <Label
                                value="Classe A (Elite) - 80%"
                                position="insideTopRight"
                                fill="#E74C3C"
                                fontSize={11}
                                fontWeight={600}
                            />
                        </ReferenceLine>

                        {/* Barras de Faturamento */}
                        <Bar
                            yAxisId="left"
                            dataKey="faturamento"
                            fill="#2C3E50"
                            radius={[4, 4, 0, 0]}
                            barSize={50}
                        >
                            <LabelList
                                dataKey="faturamento"
                                position="top"
                                fill="#ffffff"
                                fontSize={11}
                                fontWeight="bold"
                                formatter={(val) => {
                                    const v = Number(val);
                                    if (v >= 1000) {
                                        return `R$ ${formatNumber(v / 1000, 0)}k`;
                                    }
                                    return `R$ ${formatNumber(v, 0)}`;
                                }}
                            />
                        </Bar>

                        {/* Linha de % Acumulado */}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="percentAcumulado"
                            stroke="#F1C40F"
                            strokeWidth={3}
                            dot={{ fill: '#F1C40F', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>


        </div>
    );
};

export default Analytics;
