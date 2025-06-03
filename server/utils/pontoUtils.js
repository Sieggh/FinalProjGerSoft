function calcularResumoDoDia(ponto) {
  const horarios = ponto.horarios.map(h => new Date(h));
  let totalMinutos = 0;

  for (let i = 0; i < horarios.length; i += 2) {
    if (horarios[i + 1]) {
      const entrada = horarios[i];
      const saida = horarios[i + 1];
      totalMinutos += (saida - entrada) / (1000 * 60); // minutos
    }
  }

  const horas = Math.floor(totalMinutos / 60);
  const minutos = Math.floor(totalMinutos % 60);

  const status = horarios.length === 4
    ? 'completo'
    : horarios.length > 0
    ? 'parcial'
    : 'falta';

  const diferencaMin = totalMinutos - 480; // 8h * 60min
  const extra = diferencaMin > 0 ? `${Math.floor(diferencaMin / 60)}h ${diferencaMin % 60}min` : null;
  const falta = diferencaMin < 0 ? `${Math.abs(Math.floor(diferencaMin / 60))}h ${Math.abs(diferencaMin % 60)}min` : null;

  return {
    data: ponto.data.toISOString().split('T')[0],
    horarios: horarios.map(h => h.toLocaleTimeString('pt-BR')),
    totalHorasTrabalhadas: `${horas}h ${minutos}min`,
    status,
    extra,
    falta
  };
}

module.exports = { calcularResumoDoDia };
