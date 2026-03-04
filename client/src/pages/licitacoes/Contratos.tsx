import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaSearch, FaFilePdf } from 'react-icons/fa';
import api from '../../services/api';

interface Contract {
    id: number;
    year: number;
    process_number: string;
    contract_number: string;
    modality: string;
    object: string;
    status: string;
    published_at: string;
    opening_date: string;
    document_path: string;
}

const Contratos: React.FC = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [search, setSearch] = useState('');
    const [yearFilter, setYearFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContracts = async () => {
            try {
                const response = await api.get('/contracts');
                setContracts(response.data);
            } catch (error) {
                console.error('Erro ao carregar contratos:', error);
            } finally {
                setLoading(false);
            }
        };

        loadContracts();
    }, []);

    const years = [...new Set(contracts.map(c => c.year))].sort((a, b) => b - a);

    const filteredContracts = contracts.filter(contract => {
        const matchesSearch = contract.process_number.toLowerCase().includes(search.toLowerCase()) ||
            contract.object.toLowerCase().includes(search.toLowerCase());
        const matchesYear = !yearFilter || contract.year.toString() === yearFilter;
        return matchesSearch && matchesYear;
    });

    return (
        <Layout>
            <Helmet>
                <title>Contratos | SAAE Linhares</title>
            </Helmet>

            <Breadcrumb
                items={[
                    { label: 'Início', link: '/' },
                    { label: 'Licitações', link: '/licitacoes' },
                    { label: 'Contratos' }
                ]}
            />

            <div className="page-content">
                <div className="container">
                    <h1>Contratos</h1>

                    <div className="filters">
                        <div className="search-box">
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Pesquisar contratos..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">Todos os anos</option>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <div className="loading">Carregando...</div>
                    ) : (
                        <table className="contracts-table">
                            <thead>
                                <tr>
                                    <th>Ano</th>
                                    <th>Nº Processo</th>
                                    <th>Nº Contrato</th>
                                    <th>Modalidade</th>
                                    <th>Objeto</th>
                                    <th>Status</th>
                                    <th>Publicação</th>
                                    <th>Abertura</th>
                                    <th>Arquivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContracts.map(contract => (
                                    <tr key={contract.id}>
                                        <td>{contract.year}</td>
                                        <td>{contract.process_number}</td>
                                        <td>{contract.contract_number}</td>
                                        <td>{contract.modality}</td>
                                        <td>{contract.object}</td>
                                        <td>
                                            <span className={`status-badge status-${contract.status}`}>
                                                {contract.status}
                                            </span>
                                        </td>
                                        <td>{new Date(contract.published_at).toLocaleDateString('pt-BR')}</td>
                                        <td>{new Date(contract.opening_date).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            {contract.document_path && (
                                                <a
                                                    href={contract.document_path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="download-link"
                                                >
                                                    <FaFilePdf />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Contratos;