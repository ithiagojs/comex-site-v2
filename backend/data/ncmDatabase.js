/**
 * NCM Database - Nomenclatura Comum do Mercosul
 * Contém informações técnicas sobre produtos importados
 */

export const ncmDatabase = {
    drone: {
        code: '8806.22',
        description: 'Veículos aéreos não tripulados',
        estimatedMargin: 0.60, // 60% margem de lucro estimada
        defaultWeight: 0.9, // kg
        taxRate: {
            ii: 0.16,      // Imposto de Importação (16%)
            ipi: 0.12,     // IPI (12%)
            pis: 0.0165,   // PIS (1.65%)
            cofins: 0.076, // COFINS (7.6%)
            icms: 0.18     // ICMS (18%)
        }
    },
    smartphone: {
        code: '8517.13',
        description: 'Telefones móveis e de outras redes sem fio',
        estimatedMargin: 0.45, // 45% margem de lucro estimada
        defaultWeight: 0.2, // kg
        taxRate: {
            ii: 0.16,
            ipi: 0.15,
            pis: 0.0165,
            cofins: 0.076,
            icms: 0.18
        }
    }
};

export const defaultShipmentData = {
    porto: 'SANTOS',
    pais: 'CHINA'
};

/**
 * Retorna dados do NCM baseado na categoria do produto
 */
export function getNCMData(category) {
    const normalized = category.toLowerCase();

    if (normalized.includes('drone')) {
        return ncmDatabase.drone;
    } else if (normalized.includes('smartphone') || normalized.includes('celular')) {
        return ncmDatabase.smartphone;
    }

    // Fallback padrão
    return ncmDatabase.smartphone;
}
