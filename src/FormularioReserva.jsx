import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

export function FormularioReserva() {
  const [nomeConvidado, setNomeConvidado] = useState('')
  const [telefone, setTelefone] = useState('')
  const [nomeFantasia, setNomeFantasia] = useState('')
  const [fantasiasReservadas, setFantasiasReservadas] = useState([])
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' })
  const [carregando, setCarregando] = useState(false)

  const atualizarFantasias = async () => {
    const { data, error } = await supabase
      .from('fantasias_reservadas')
      .select('nome_fantasia')

    if (error) {
      console.error('Erro ao carregar fantasias:', error)
    } else if (data) {
      setFantasiasReservadas(data.map((item) => item.nome_fantasia))
    }
  }

  useEffect(() => {
    let montado = true

    async function buscarFantasiasIniciais() {
      const { data, error } = await supabase
        .from('fantasias_reservadas')
        .select('nome_fantasia')

      if (montado) {
        if (error) {
          console.error('Erro ao carregar fantasias:', error)
        } else if (data) {
          setFantasiasReservadas(data.map((item) => item.nome_fantasia))
        }
      }
    }

    buscarFantasiasIniciais()

    return () => {
      montado = false
    }
  }, [])

  // Função auxiliar para remover acentos, símbolos (hífens, pontuações), espaços e letras repetidas
  const normalizarFantasia = (texto) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]/g, '')       // Remove tudo o que não for letra ou número
      .replace(/(.)\1+/g, '$1')        // Remove letras/números repetidos em sequência (ex: 'aa' -> 'a')
  }

// Máscara fluida de telefone sem travamento no Backspace
  const handleTelefoneChange = (e) => {
    let input = e.target.value.replace(/\D/g, '') // Mantém apenas números

    if (input.length > 11) input = input.slice(0, 11)

    // Aplica a formatação dinamicamente conforme a quantidade de dígitos
    if (input.length > 10) {
      // Telemóvel/Celular com 11 dígitos: (11) 98596-1234
      setTelefone(`(${input.slice(0, 2)}) ${input.slice(2, 7)}-${input.slice(7)}`)
    } else if (input.length > 6) {
      // De 7 a 10 dígitos: (11) 9859-6123
      setTelefone(`(${input.slice(0, 2)}) ${input.slice(2, 6)}-${input.slice(6)}`)
    } else if (input.length > 2) {
      // De 3 a 6 dígitos: (11) 9859
      setTelefone(`(${input.slice(0, 2)}) ${input.slice(2)}`)
    } else {
      // Até 2 dígitos, mantém só os números para conseguir apagar livremente
      setTelefone(input)
    }
  }

  const handleReservar = async (e) => {
    e.preventDefault()
    setMensagem({ texto: '', tipo: '' })

    const telefoneNumerico = telefone.replace(/\D/g, '')

    if (!nomeConvidado.trim() || !nomeFantasia.trim() || !telefone.trim()) {
      setMensagem({
        texto: 'Por favor, preencha o seu nome, WhatsApp e a sua fantasia.',
        tipo: 'erro',
      })
      return
    }

    if (telefoneNumerico.length < 10) {
      setMensagem({
        texto: 'Por favor, digite um número de WhatsApp válido com DDD.',
        tipo: 'erro',
      })
      return
    }

    // Aplica a limpeza rigorosa na fantasia digitada
    const fantasiaLimpa = normalizarFantasia(nomeFantasia)

    // Compara com as fantasias da lista aplicadamente limpas
    const jaExiste = fantasiasReservadas.some(
      (f) => normalizarFantasia(f) === fantasiaLimpa
    )

    if (jaExiste) {
      setMensagem({
        texto: 'Esta fantasia já foi reservada! Escolha outra.',
        tipo: 'erro',
      })
      return
    }

    setCarregando(true)

    const { error } = await supabase
      .from('reservas')
      .insert([
        {
          nome_convidado: nomeConvidado.trim(),
          telefone: telefoneNumerico,
          nome_fantasia: nomeFantasia.trim(),
        },
      ])

    setCarregando(false)

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('idx_telefone_unico') || error.details?.includes('telefone')) {
          setMensagem({
            texto: 'Este número de telefone já realizou uma reserva! Cada convidado só pode reservar 1 fantasia.',
            tipo: 'erro',
          })
        } else {
          setMensagem({
            texto: 'Esta fantasia já foi reservada por outra pessoa! Escolha outra.',
            tipo: 'erro',
          })
        }
      } else {
        setMensagem({
          texto: `Erro no banco: ${error.message || 'Falha na conexão'}`,
          tipo: 'erro',
        })
      }
    } else {
      setMensagem({
        texto: 'Fantasia reservada com sucesso! Mal podemos esperar para te ver na festa!',
        tipo: 'sucesso',
      })
      setNomeConvidado('')
      setTelefone('')
      setNomeFantasia('')
      atualizarFantasias()
    }
  }

return (
    <div
      className="glow-box"
      style={{
        backgroundColor: 'rgba(20, 18, 25, 0.9)',
        borderRadius: '16px',
        padding: '30px',
      }}
    >
      <h3 className="fonte-vazada" style={{ textAlign: 'center', marginTop: 0, marginBottom: '20px', fontSize: '1.8rem' }}>
        Reserve sua Fantasia
      </h3>

      <form onSubmit={handleReservar} style={{ marginBottom: '25px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#ff007f', fontSize: '0.85rem', letterSpacing: '1px' }}>
            SEU NOME:
          </label>
          <input
            type="text"
            value={nomeConvidado}
            onChange={(e) => setNomeConvidado(e.target.value)}
            placeholder="Ex: Paolla Felix"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ff007f',
              backgroundColor: '#0b0a0d',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#ff007f', fontSize: '0.85rem', letterSpacing: '1px' }}>
            WHATSAPP / TELEFONE:
          </label>
          <input
            type="text"
            value={telefone}
            onChange={handleTelefoneChange}
            placeholder="(11) 99999-9999"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ff007f',
              backgroundColor: '#0b0a0d',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#ff007f', fontSize: '0.85rem', letterSpacing: '1px' }}>
            SUA FANTASIA:
          </label>
          <input
            type="text"
            value={nomeFantasia}
            onChange={(e) => setNomeFantasia(e.target.value)}
            placeholder="Ex: Mulher Maravilha, Homem Aranha..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ff007f',
              backgroundColor: '#0b0a0d',
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="btn-neon"
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {carregando ? 'RESERVANDO...' : 'GARANTIR A MINHA FANTASIA'}
        </button>
      </form>

      {mensagem.texto && (
        <div
          style={{
            padding: '12px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: mensagem.tipo === 'erro' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 127, 0.2)',
            border: `1px solid ${mensagem.tipo === 'erro' ? '#ff4d4d' : '#00ff7f'}`,
            color: mensagem.tipo === 'erro' ? '#ff4d4d' : '#00ff7f',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {mensagem.texto}
        </div>
      )}

      {/* Lista de Fantasias Reservadas */}
      <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255, 0, 127, 0.3)' }}>
        <h4 style={{ color: '#ff007f', marginBottom: '15px', textAlign: 'center', letterSpacing: '1px' }}>
          FANTASIAS JÁ RESERVADAS:
        </h4>
        {fantasiasReservadas.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
            Nenhuma fantasia reservada ainda. Seja o primeiro!
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {fantasiasReservadas.map((fantasia, idx) => (
              <span
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 0, 127, 0.15)',
                  color: '#ff007f',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  border: '1px solid #ff007f',
                  boxShadow: '0 0 8px rgba(255, 0, 127, 0.3)',
                }}
              >
                ✨ {fantasia}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Box de Aviso/Suporte */}
      <div
        style={{
          marginTop: '25px',
          padding: '12px 16px',
          backgroundColor: 'rgba(255, 0, 127, 0.08)',
          borderRadius: '10px',
          border: '1px dashed #ff007f',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#ccc',
          lineHeight: '1.4',
        }}
      >
        💡 <strong style={{ color: '#ff007f' }}>Precisa alterar algo?</strong> Se você digitou o nome da sua fantasia errado ou quiser trocar a sua reserva depois, entre em contato diretamente com a <strong>Paolla</strong>!
      </div>
    </div>
  )
}