import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/layout/Breadcrumb';
import { FaUser, FaEnvelope, FaPhone, FaComment } from 'react-icons/fa';
import api from '../../services/api';
import Alert from '../../components/ui/Alert';

const Contato: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Contato | SAAE Linhares</title>
      </Helmet>

      <Breadcrumb 
        items={[
          { label: 'Início', link: '/' },
          { label: 'Atendimento', link: '/atendimento' },
          { label: 'Contato' }
        ]}
      />

      <div className="page-content">
        <div className="container">
          <h1>Fale Conosco</h1>
          
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Informações de Contato</h2>
              <p><FaPhone /> (27) 2103-1311</p>
              <p><FaEnvelope /> atendimento@saaelinhares.com.br</p>
              <p>Atendimento: Segunda a sexta, 07:30 às 16:30</p>
              
              <h2>Ouvidoria</h2>
              <p>Para reclamações, sugestões e elogios, utilize o formulário ao lado ou entre em contato diretamente com nossa ouvidoria.</p>
            </div>

            <div className="contact-form">
              {success && (
                <Alert 
                  type="success" 
                  message="Mensagem enviada com sucesso! Em breve retornaremos." 
                  onClose={() => setSuccess(false)}
                />
              )}
              
              {error && (
                <Alert 
                  type="error" 
                  message={error} 
                  onClose={() => setError('')}
                />
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser /> Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope /> E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    <FaPhone /> Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Assunto</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="duvida">Dúvida</option>
                    <option value="reclamacao">Reclamação</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="elogio">Elogio</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    <FaComment /> Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contato;