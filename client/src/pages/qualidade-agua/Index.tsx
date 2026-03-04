import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaSearch, FaFilePdf } from 'react-icons/fa';
import api from '../../services/api';

interface Report {
  id: number;
  report_name: string;
  report_file: string;
  report_date: string;
}

const QualidadeAgua: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await api.get('/water-quality');
        setReports(response.data);
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const filteredReports = reports.filter(report =>
    report.report_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <Helmet>
        <title>Qualidade da Água | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Qualidade da Água' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Qualidade da Água</h1>
          
          <p className="intro-text">
            Acompanhe os relatórios de qualidade da água distribuída em Linhares.
            Realizamos análises periódicas para garantir que a água fornecida atenda
            aos padrões de potabilidade estabelecidos pelo Ministério da Saúde.
          </p>

          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Pesquisar relatórios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Nome do Relatório</th>
                  <th>Data</th>
                  <th>Arquivo</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report.id}>
                    <td>{report.report_name}</td>
                    <td>{new Date(report.report_date).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <a 
                        href={report.report_file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="download-link"
                      >
                        <FaFilePdf /> Download PDF
                      </a>
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

export default QualidadeAgua;