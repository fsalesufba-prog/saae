import React, { useState, useEffect } from 'react';
import api from '../../../services/api';

const SettingsIndex: React.FC = () => {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings', settings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Configurações</h1>
      <form onSubmit={handleSave}>
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default SettingsIndex;
