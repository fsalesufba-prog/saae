import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';

const PaymentLocationsEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    hours: '',
    phone: '',
    type: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/payment-locations/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/payment-locations/${id}`, formData);
      navigate('/admin/payment-locations');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Editar Local de Pagamento</h1>
      <form onSubmit={handleSubmit}>
        <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome" />
        <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Endereço" />
        <input value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} placeholder="Horário" />
        <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Telefone" />
        <input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Tipo" />
        <button type="submit">Salvar</button>
        <button type="button" onClick={() => navigate('/admin/payment-locations')}>Cancelar</button>
      </form>
    </div>
  );
};

export default PaymentLocationsEdit;
