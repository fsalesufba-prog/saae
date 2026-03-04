import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus, FaFilePdf } from 'react-icons/fa';

interface Report {
  id: number;
  report_name: string;
  report_file: string;
  report_date: string;
}

const WaterQualityList: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este relatório?')) {
      return;
    }

    try {
      await api.delete(`/water-quality/${id}`);
      loadReports();
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
    }
  };

  const columns = [
    { key: 'report_name', title: 'Nome do Relatório' },
    { 
      key: 'report_date', 
      title: 'Data',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      key: 'report_file',
      title: 'Arquivo',
      render: (_: any, row: Report) => row.report_file && (
        <a 
          href={row.report_file} 
          target="_blank" 
          rel="noopener noreferrer"
          className="download-link"
        >
          <FaFilePdf />
        </a>
      )
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (_: any, row: Report) => (
        <div className="actions">
          <Link to={`/admin/water-quality/edit/${row.id}`} className="btn-edit">
            <FaEdit />
          </Link>
          <button onClick={() => handleDelete(row.id)} className="btn-delete">
            <FaTrash />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="water-quality-page">
      <div className="page-header">
        <h1>Qualidade da Água</h1>
        <Link to="/admin/water-quality/create" className="btn-primary">
          <FaPlus /> Novo Relatório
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={reports}
        loading={loading}
      />
    </div>
  );
};

export default WaterQualityList;