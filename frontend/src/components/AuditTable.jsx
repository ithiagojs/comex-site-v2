import React from 'react';
import { formatBRL, formatUSD, formatWeight } from '../utils/formatters';

const AuditTable = ({ auditData, onRemove, onExport }) => {
    if (auditData.length === 0) return null;

    return (
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
                                            onClick={() => onRemove(item.id)}
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

                <button className="export-btn" onClick={onExport}>
                    📥 Exportar CSV para Siscomex
                </button>
            </div>
        </section>
    );
};

export default AuditTable;
