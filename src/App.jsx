import { useState } from 'react'
import { FormularioReserva } from './FormularioReserva'
import { Admin } from './Admin'
import photoPaolla from './assets/photoPaolla.jpg'
import './App.css'

function App() {
  const [verAdmin, setVerAdmin] = useState(false)

  const dadosFesta = {
    nome: 'Paolla',
    subtitulo: 'FESTA À FANTASIA',
    idade: '30 YEARS',
    data: '12.12.26',
    horario: '19:00H',
    endereco: 'Rua Juan de La Cruz, nº 245 - Cidade Ademar (Próximo à Av. Cupecê e Casa Palma)',
  }

  return (
    <div style={{ backgroundColor: '#0b0a0d', minHeight: '100vh', color: '#fff', paddingBottom: '40px' }}>
      
      
{/* Botão Admin e Cabeçalho com espaçamento ajustado */}
      <header style={{ position: 'relative', paddingTop: '65px', paddingBottom: '10px', textAlign: 'center', zIndex: 2 }}>
        <button
          onClick={() => setVerAdmin(!verAdmin)}
          style={{
            position: 'absolute',
            top: '15px', /* Subiu o botão para dar mais respiro ao título */
            right: '20px',
            background: 'transparent',
            border: '1px solid #ff007f',
            color: '#ff007f',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '11px',
            cursor: 'pointer',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
        >
          {verAdmin ? '← VOLTAR' : '🔒 ADMIN'}
        </button>

        {/* Título com espaço superior extra */}
        <div style={{ marginTop: '25px' }}>
          <span className="fonte-script" style={{ fontSize: '3.5rem', display: 'block', lineHeight: '0.9' }}>
            Aniversário da
          </span>
          <h1 className="fonte-vazada" style={{ fontSize: '3.8rem', margin: '5px 0' }}>
            {dadosFesta.nome}
          </h1>
          <div className="subtitulo-festa" style={{ color: '#ff007f', fontWeight: 'bold', letterSpacing: '3px', fontSize: '1rem' }}>
            ✦ {dadosFesta.subtitulo} • {dadosFesta.idade} ✦
          </div>
        </div>
      </header>

      <main style={{ padding: '20px', maxWidth: '750px', margin: '0 auto' }}>
        {verAdmin ? (
          <Admin />
        ) : (
          <>
            {/* Card Principal de Apresentação */}
            <section
              className="glow-box"
              style={{
                backgroundColor: 'rgba(20, 18, 25, 0.9)',
                borderRadius: '16px',
                padding: '30px',
                marginBottom: '35px',
                textAlign: 'center',
              }}
            >
              {/* Foto da Paolla com Borda Neon */}
              <div style={{ marginBottom: '20px', display: 'inline-block', position: 'relative' }}>
                <img
                  src={photoPaolla}
                  alt="Paolla"
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #ff007f',
                    boxShadow: '0 0 20px rgba(255, 0, 127, 0.8)',
                  }}
                />
              </div>

              <h2 className="fonte-script" style={{ fontSize: '2.5rem', margin: '10px 0' }}>
                Você está Convidado!
              </h2>
              <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: '1.5', marginBottom: '25px' }}>
                Prepare sua melhor fantasia e venha curtir essa loucura que será o meu 
              </p>
              <p style={{ color: '#ff007f', fontSize: '1.2rem', fontWeight: 'bold', lineHeight: '1.5', marginBottom: '25px' }}>
                30tou!
              </p>
              <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: '1.5', marginBottom: '25px' }}>
                Compra de bebidas será feita no local!
              </p>              

{/* Grid com Informações Centralizadas */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '15px',
                  justifyContent: 'center',
                  maxWidth: '500px',
                  margin: '0 auto',
                }}
              >
                <div style={{ border: '1px solid #ff007f', padding: '15px', borderRadius: '8px', backgroundColor: '#141219', textAlign: 'center' }}>
                  <span style={{ color: '#ff007f', fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>DATA</span>
                  <strong style={{ fontSize: '1.2rem', fontFamily: 'Syne' }}>{dadosFesta.data}</strong>
                </div>
                <div style={{ border: '1px solid #ff007f', padding: '15px', borderRadius: '8px', backgroundColor: '#141219', textAlign: 'center' }}>
                  <span style={{ color: '#ff007f', fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>HORÁRIO</span>
                  <strong style={{ fontSize: '1.2rem', fontFamily: 'Syne' }}>{dadosFesta.horario}</strong>
                </div>
                <div style={{ border: '1px solid #ff007f', padding: '15px', borderRadius: '8px', backgroundColor: '#141219', gridColumn: '1 / -1', textAlign: 'center' }}>
                  <span style={{ color: '#ff007f', fontSize: '0.8rem', fontWeight: 'bold', display: 'block' }}>ENDEREÇO</span>
                  <strong style={{ fontSize: '1rem' }}>{dadosFesta.endereco}</strong>
                </div>
              </div>
            </section>

            {/* Formulário de Reserva */}
            <FormularioReserva />
          </>
        )}
      </main>
    </div>
  )
}

export default App