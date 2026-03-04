import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus, FaFilePdf } from 'react-icons/fa';

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

const ContractsList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContracts();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este contrato?')) {
      return;
    }

    try {
      await api.delete(`/contracts/${id}`);
      loadContracts();
    } catch (error) {
      console.error('Erro ao excluir contrato:', error);
    }
  };

  const columns = [
    { key: 'year', title: 'Ano' },
    { key: 'process_number', title: 'Nº Processo' },
    { key: 'contract_number', title: 'Nº Contrato' },
    { key: 'modality', title: 'Modalidade' },
    { key: 'object', title: 'Objeto' },
    { key: 'status', title: 'Status' },
    { 
      key: 'published_at', 
      title: 'Publicação',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    { 
      key: 'opening_date', 
      title: 'Abertura',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    {
      key: 'document',
      title: 'Arquivo',
      render: (_: any, row: Contract) => row.document_path && (
        <a 
          href={row.document_path} 
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
      render: (_: any, row: Contract) => (
        <div className="actions">
          <Link to={`/admin/contracts/edit/${row.id}`} className="btn-edit">
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
    <div className="contracts-page">
      <div className="page-header">
        <h1>Contratos</h1>
        <Link to="/admin/contracts/create" className="btn-primary">
          <FaPlus /> Novo Contrato
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={contracts}
        loading={loading}
      />
    </div>
  );
};

export default ContractsList;