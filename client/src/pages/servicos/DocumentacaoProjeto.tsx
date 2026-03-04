import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaCheckCircle, FaFilePdf } from 'react-icons/fa';
import api from '../../services/api';

interface Document {
  id: number;
  document_name: string;
  description: string;
  required: boolean;
}

const DocumentacaoProjeto: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await api.get('/project-documentation');
        setDocuments(response.data);
      } catch (error) {
        console.error('Erro ao carregar documentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Documentação para Projeto Hidrossanitário | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Serviços', link: '/servicos' },
          { label: 'Documentação para Projeto' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Documentação para Aprovação de Projeto Hidrossanitário</h1>
          
          {loading ? (
            <div className="loading">Carregando...</div>
          ) : (
            <div className="documentation-list">
              <div className="documentation-header">
                <p>Lista de documentos necessários para aprovação de projetos:</p>
              </div>
              
              {documents.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className="document-icon">
                    {doc.required ? <FaCheckCircle className="required" /> : <FaFilePdf />}
                  </div>
                  <div className="document-info">
                    <h3>{doc.document_name}</h3>
                    <p>{doc.description}</p>
                    <span className={`document-badge ${doc.required ? 'required' : 'optional'}`}>
                      {doc.required ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DocumentacaoProjeto;