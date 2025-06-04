import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const CadastroFuncionario = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    matricula: '',
    dataAdmissao: '',
    senha: '',
    empresa: '',
    nomeCargo: '',
    nomeSetor: ''
  });

  const [cargos, setCargos] = useState([]);
  const [setores, setSetores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario')) || {};
    const nomeEmpresa = usuarioLocal.empresa || '';

    setFormData((prev) => ({ ...prev, empresa: nomeEmpresa }));

    if (nomeEmpresa) {
      carregarCargos(nomeEmpresa);
      carregarSetores(nomeEmpresa);
    }
  }, []);

  const carregarCargos = async (empresa) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/cargos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCargos(res.data);
    } catch (err) {
      console.error('Erro ao carregar cargos:', err);
    }
  };

  const carregarSetores = async (empresa) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/setores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSetores(res.data);
    } catch (err) {
      console.error('Erro ao carregar setores:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/api/usuarios/funcionario',
        {
          ...formData,
          nomeEmpresa: formData.empresa
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Funcionário cadastrado com sucesso!');
      navigate('/dashboard/funcionarios');
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar funcionário.');
    }
  };

  const handleCancelar = () => {
    setFormData((prev) => ({
      nomeCompleto: '',
      cpf: '',
      matricula: '',
      dataAdmissao: '',
      senha: '',
      nomeCargo: '',
      nomeSetor: '',
      empresa: prev.empresa
    }));
  };

  return (
    <div className="card">
      <header className="header">
        <FaArrowLeft
          style={{ cursor: 'pointer', marginRight: '10px' }}
          onClick={() => navigate('/dashboard/funcionarios')}
        />
        <h3 style={{ display: 'inline' }}>Cadastro de Funcionário</h3>
      </header>

      <div className="perfil-content">
        <div className="perfil-form">
          <div className="coluna">
            <label>Nome Completo</label>
            <input name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} />

            <label>CPF</label>
            <input name="cpf" value={formData.cpf} onChange={handleChange} />

            <label>Matrícula</label>
            <input name="matricula" value={formData.matricula} onChange={handleChange} />

            <label>Data de Admissão</label>
            <input type="date" name="dataAdmissao" value={formData.dataAdmissao} onChange={handleChange} />
          </div>

          <div className="coluna">
            <label>Senha</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} />

            <label>Cargo</label>
            <select name="nomeCargo" value={formData.nomeCargo} onChange={handleChange}>
              <option value="">Selecione o cargo</option>
              {cargos.map((cargo) => (
                <option key={cargo._id} value={cargo.nome}>{cargo.nome}</option>
              ))}
            </select>

            <label>Setor</label>
            <select name="nomeSetor" value={formData.nomeSetor} onChange={handleChange}>
              <option value="">Selecione o setor</option>
              {setores.map((setor) => (
                <option key={setor._id} value={setor.nome}>{setor.nome}</option>
              ))}
            </select>

            <label>Empresa</label>
            <input name="empresa" value={formData.empresa} disabled />
          </div>
        </div>
      </div>

      <div className="perfil-actions">
        <button className="botao-salvar" onClick={handleSalvar}>Salvar</button>
        <button className="botao-cancelar" onClick={handleCancelar}>Cancelar</button>
      </div>
    </div>
  );
};

export default CadastroFuncionario;
