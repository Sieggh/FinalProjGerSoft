import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const EditarCargo = () => {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: ''
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const [originalNome, setOriginalNome] = useState('');

  useEffect(() => {
    const fetchCargo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/cargos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setFormData({
          nome: response.data.nome,
          empresa: response.data.empresa?.nome || ''
        });

        setOriginalNome(response.data.nome); 
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar os dados do cargo.');
      }
    };

    fetchCargo();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:4000/api/cargos/${id}`, {
        nome: formData.nome
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Cargo atualizado com sucesso!');
      navigate('/dashboard/cargos');
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar cargo');
    }
  };

    const handleCancelar = () => {
    setFormData({ nome: originalNome, empresa: formData.empresa });
    };

  return (
    <div className="card">
      <div className="header">
        <FaArrowLeft
          style={{ cursor: 'pointer', marginRight: '10px' }}
          onClick={() => navigate('/dashboard/cargos')}
        />
        <h3 style={{ display: 'inline' }}>Editar Cargo</h3>
      </div>

      <div className="perfil-content">
        <div className="perfil-form">
          <div className="coluna">
            <label>Nome do Cargo</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </div>

          <div className="coluna">
            <label>Empresa</label>
            <input
              type="text"
              name="empresa"
              value={formData.empresa}
              disabled
            />
          </div>
        </div>
      </div>

      <div className="perfil-actions">
        <button className="botao-salvar" onClick={handleSalvar} disabled={!formData.nome || formData.nome === originalNome}>
          Salvar
        </button>
        <button className="botao-cancelar" onClick={handleCancelar}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditarCargo;
