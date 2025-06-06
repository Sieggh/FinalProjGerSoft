import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const EditarFuncionario = () => {
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
  const [dadosOriginais, setDadosOriginais] = useState(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem('usuario')) || {};
    const nomeEmpresa = usuarioLocal.empresa || '';
    setFormData((prev) => ({ ...prev, empresa: nomeEmpresa }));

    if (nomeEmpresa) {
      carregarCargos(nomeEmpresa);
      carregarSetores(nomeEmpresa);
    }

    const carregar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:4000/api/usuarios/funcionario/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const func = res.data;

        const dados = {
          nomeCompleto: func.nomeCompleto,
          cpf: func.cpf,
          matricula: func.matricula,
          dataAdmissao: func.dataAdmissao.split('T')[0],
          senha: '',
          nomeEmpresa: nomeEmpresa?.nome,
          nomeCargo: func.idCargo || '',
          nomeSetor: func.idSetor || ''
        };

        setFormData(dados);
        setDadosOriginais(dados);
      } catch (err) {
        console.error(err);
        alert('Erro ao carregar dados do funcionário');
      }
    };

    carregar();
  }, [id]);

  const carregarCargos = async () => {
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

  const carregarSetores = async () => {
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
      const usuarioLocal = JSON.parse(localStorage.getItem('usuario')) || {};
      const token = localStorage.getItem('token');
      const nomeEmpresa = usuarioLocal.empresa || '';

      const nomeCargo = cargos.find(c => c.id === formData.nomeCargo)?.nome || '';
      const nomeSetor = setores.find(s => s.id === formData.nomeSetor)?.nome || '';

      await axios.put(
        `http://localhost:4000/api/usuarios/funcionario/${id}`,
        {
          nomeCompleto: formData.nomeCompleto,
          cpf: formData.cpf,
          matricula: formData.matricula,
          dataAdmissao: formData.dataAdmissao,
          senha: formData.senha,
          nomeEmpresa: nomeEmpresa,
          nomeCargo,
          nomeSetor
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Funcionário atualizado com sucesso!');
      navigate('/dashboard/funcionarios');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar funcionário.');
    }
  };

  const handleCancelar = () => {
    if (dadosOriginais) {
      setFormData(dadosOriginais);
    }
    setModoEdicao(false);
  };

  const houveAlteracao = JSON.stringify(formData) !== JSON.stringify(dadosOriginais);

  return (
    <div className="card">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaArrowLeft
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => navigate('/dashboard/funcionarios')}
          />
          <h3 style={{ display: 'inline' }}>Editar Funcionário</h3>
        </div>
        <button className="botao-salvar" onClick={() => navigate(`/dashboard/folhaponto/${id}`)}>
          Folha de Ponto
        </button>
      </header>

      <div className="perfil-content">
        <div className="perfil-form">
          <div className="coluna">
            <label>Nome Completo</label>
            <input name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} disabled={!modoEdicao} />

            <label>CPF</label>
            <input name="cpf" value={formData.cpf} onChange={handleChange} disabled={!modoEdicao} />

            <label>Matrícula</label>
            <input name="matricula" value={formData.matricula} onChange={handleChange} disabled={!modoEdicao} />

            <label>Data de Admissão</label>
            <input type="date" name="dataAdmissao" value={formData.dataAdmissao} onChange={handleChange} disabled={!modoEdicao} />
          </div>

          <div className="coluna">
            <label>Senha (opcional)</label>
            <input type="password" name="senha" value={formData.senha} onChange={handleChange} disabled={!modoEdicao} />

            <label>Cargo</label>
            <select name="nomeCargo" value={formData.nomeCargo} onChange={handleChange} disabled={!modoEdicao}>
              <option value="">Selecione o cargo</option>
              {cargos.map((cargo) => (
                <option key={cargo.id} value={cargo.id}>{cargo.nome}</option>
              ))}
            </select>

            <label>Setor</label>
            <select name="nomeSetor" value={formData.nomeSetor} onChange={handleChange} disabled={!modoEdicao}>
              <option value="">Selecione o setor</option>
              {setores.map((setor) => (
                <option key={setor.id} value={setor.id}>{setor.nome}</option>
              ))}
            </select>

            <label>Empresa</label>
            <input name="empresa" value={formData.empresa} disabled />
          </div>
        </div>
      </div>

      <div className="perfil-actions">
        {modoEdicao ? (
          <>
            <button className="botao-salvar" onClick={handleSalvar} disabled={!houveAlteracao}>Salvar</button>
            <button className="botao-cancelar" onClick={handleCancelar}>Cancelar</button>
          </>
        ) : (
          <button className="botao-salvar" onClick={() => setModoEdicao(true)}>Editar</button>
        )}
      </div>
    </div>
  );
};

export default EditarFuncionario;
