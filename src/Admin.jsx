import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export function Admin() {
  const [autenticado, setAutenticado] = useState(false)
  const [senha, setSenha] = useState('')
  const [reservas, setReservas] = useState([])
  const [erro, setErro] = useState('')

  const SENHA_ADMIN = 'paollinhadazs'

  useEffect(() => {
    if (autenticado) {
      carregarTodasReservas()
    }
  }, [autenticado])

  const handleLogin = (e) => {
    e.preventDefault()
    if (senha === SENHA_ADMIN) {
      setAutenticado(true)
      setErro('')
    } else {
      setErro('Senha incorreta!')
    }
  }

  const carregarTodasReservas = async () => {
    const { data, error } = await supabase
      .from('reservas')
      .select('id, nome_convidado, nome_fantasia, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar reservas no Admin:', error)
    } else if (data) {
      setReservas(data)
    }
  }

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza de que deseja remover esta reserva?')) {
      const { error } = await supabase.from('reservas').delete().eq('id', id)

      if (error) {
        alert('Erro ao excluir reserva.')
      } else {
        carregarTodasReservas()
      }
    }
  }

  const formatarDataHora = (dataIso) => {
    if (!dataIso) return '-'
    const data = new Date(dataIso)
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!autenticado) {
    return (
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          maxWidth: '400px',
          margin: '20px auto',
          boxShadow: '0 8px 20px rgba(214, 51, 132, 0.15)',
          border: '2px solid #f8d7da',
          textAlign: 'center',
          color: '#333',
        }}
      >
        <h3 style={{ color: '#c2185b', marginTop: 0 }}>Área Restrita - Paolla</h3>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Digite a senha de admin"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '8px',
              border: '1.5px solid #f8b4c4',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#d63384',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Entrar
          </button>
        </form>
        {erro && <p style={{ color: '#dc3545', marginTop: '10px' }}>{erro}</p>}
      </div>
    )
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '12px', /* Padding reduzido para dar mais espaço */
        boxShadow: '0 8px 20px rgba(214, 51, 132, 0.15)',
        border: '2px solid #f8d7da',
        color: '#333',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ color: '#c2185b', margin: 0, fontSize: '1.1rem' }}>Painel da Anfitriã</h3>
        <button
          onClick={() => setAutenticado(false)}
          style={{
            padding: '4px 10px',
            backgroundColor: '#6c757d',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          Sair
        </button>
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f8b4c4', color: '#c2185b' }}>
              <th style={{ padding: '6px 4px', fontSize: '0.75rem', width: '28%' }}>Convidado</th>
              <th style={{ padding: '6px 4px', fontSize: '0.75rem', width: '30%' }}>Fantasia</th>
              <th style={{ padding: '6px 4px', fontSize: '0.75rem', width: '26%' }}>Horário</th>
              <th style={{ padding: '6px 2px', fontSize: '0.75rem', width: '16%', textAlign: 'center' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '15px', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                  Nenhuma reserva realizada ainda.
                </td>
              </tr>
            ) : (
              reservas.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #ffe6ed' }}>
                  <td style={{ padding: '6px 4px', fontWeight: 'bold', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                    {item.nome_convidado}
                  </td>
                  <td style={{ padding: '6px 4px', fontSize: '0.75rem', wordBreak: 'break-word' }}>
                    {item.nome_fantasia}
                  </td>
                  <td style={{ padding: '6px 4px', color: '#666', fontSize: '0.68rem', lineBreak: 'anywhere' }}>
                    {formatarDataHora(item.created_at)}
                  </td>
                  <td style={{ padding: '6px 2px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleExcluir(item.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                      }}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}