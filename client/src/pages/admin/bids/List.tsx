import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import DataTable from '../../../components/admin/DataTable';
import { FaEdit, FaTrash, FaPlus, FaFilePdf } from 'react-icons/fa';

interface Bid {
  id: number;
  process_number: string;
  modality: string;
  object: string;
  status: string;
  publish_date: string;
  opening_date: string;
  document_path: string;
}

const BidsList: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = async () => {
    try {
      const response = await api.get('/bids');
      setBids(response.data);
    } catch (error) {
      console.error('Erro ao carregar licitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta licitação?')) {
      return;
    }

    try {
      await api.delete(`/bids/${id}`);
      loadBids();
    } catch (error) {
      console.error('Erro ao excluir licitação:', error);
    }
  };

  const getStatusClass = (status: string) => {
    return `status-${status}`;
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'aberta': 'Aberta',
      'homologada': 'Homologada',
      'fracassada': 'Fracassada',
      'andamento': 'Em Andamento'
    };
    return statusMap[status] || status;
  };

  const columns = [
    { key: 'process_number', title: 'Nº Processo' },
    { key: 'modality', title: 'Modalidade' },
    { key: 'object', title: 'Objeto' },
    {
      key: 'status',
      title: 'Status',
      render: (status: string) => (
        <span className={`bid-status ${getStatusClass(status)}`}>
          {getStatusText(status)}
        </span>
      )
    },
    { 
      key: 'publish_date', 
      title: 'Publicação',
      render: (date: string) => new Date(date).toLocaleDateString('pt-BR')
    },
    { 
      key: 'opening_date', 
      title: 'Abertura',
      render: (date: string) => new Date(date).toLocaleString('pt-BR')
    },
    {
      key: 'document',
      title: 'Edital',
      render: (_: any, row: Bid) => row.document_path && (
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
      render: (_: any, row: Bid) => (
        <div className="actions">
          <Link to={`/admin/bids/edit/${row.id}`} className="btn-edit">
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
    <div className="bids-page">
      <div className="page-header">
        <h1>Licitações</h1>
        <Link to="/admin/bids/create" className="btn-primary">
          <FaPlus /> Nova Licitação
        </Link>
      </div>

      <DataTable 
        columns={columns}
        data={bids}
        loading={loading}
      />
    </div>
  );
};

export default BidsList;