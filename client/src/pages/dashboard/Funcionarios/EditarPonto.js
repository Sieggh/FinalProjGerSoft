import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const EditarPonto = () => {
  const { id, data } = useParams(); 
  const [horarios, setHorarios] = useState(['']);
  const [original, setOriginal] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:4000/api/ponto/usuario/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const pontoDoDia = res.data.folha.find(p => p.data === data);
        if (pontoDoDia) {
          setHorarios(pontoDoDia.horarios);
          setOriginal([...pontoDoDia.horarios]);
        } else {
          setHorarios(['']);
          setOriginal(['']);
        }
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados do ponto.');
      }
    };

    carregarDados();
  }, [id, data]);

  const handleChangeHorario = (index, value) => {
    const atualizados = [...horarios];
    atualizados[index] = value;
    setHorarios(atualizados);
  };

  const handleAdicionarHorario = () => {
    if (horarios.length < 4) {
      setHorarios([...horarios, '']);
    }
  };

  const handleRemoverHorario = (index) => {
    const atualizados = horarios.filter((_, i) => i !== index);
    setHorarios(atualizados);
  };

  const handleSalvar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:4000/api/ponto/atualizar/${id}/${data}`, {
        idUsuario: id,
        data: data,
        horarios: horarios.map(h => h.slice(0, 5))
        }, {
        headers: { Authorization: `Bearer ${token}` }
       });

      alert('Ponto atualizado com sucesso!');
      navigate(`/dashboard/folhaponto/${id}`);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar ponto.');
    }
  };

    const formatarData = (dataIso) => {
        const data = new Date(dataIso);
        data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
        return data.toLocaleDateString('pt-BR');
    };

  const houveAlteracao = JSON.stringify(horarios) !== JSON.stringify(original);

  return (
    <div className="card">
      <div className="header">
          <FaArrowLeft style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate(-1)} />
          <h3>Editar Ponto - {formatarData(data)}</h3>
        </div>

      {horarios.map((hora, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <input
            type="time"
            value={hora}
            onChange={(e) => handleChangeHorario(i, e.target.value)}
            style={{ marginRight: '10px' }}
          />
          {horarios.length > 1 && (
            <button onClick={() => handleRemoverHorario(i)} style={{ color: 'red' }}>Remover</button>
          )}
        </div>
      ))}

      {horarios.length < 4 && (
        <button onClick={handleAdicionarHorario} className="botao-cancelar">Adicionar Horário</button>
      )}

      <div className="perfil-actions" style={{ marginTop: '20px' }}>
        <button className="botao-salvar" onClick={handleSalvar} disabled={!houveAlteracao}>
          Salvar
        </button>
      </div>
    </div>
  );
};

export default EditarPonto;
