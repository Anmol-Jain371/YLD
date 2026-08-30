import React, { useState } from 'react'
import { BookOpen, X, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react'

export function DiseaseCatalog({ diseases, isOpen, onClose, onSelectDisease }) {
  const [selectedIdx, setSelectedIdx] = useState(0)

  if (!isOpen) return null

  const classes = diseases?.classes || []
  const details = diseases?.details || {}
  const current = details[selectedIdx] || {}

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#0d1410',
          border: '1px solid var(--border-card-hover)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--emerald-400)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              Arecanut Plant Disease Knowledge Base (9 Classes)
            </h3>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '6px 10px' }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1, overflow: 'hidden' }}>
          {/* Class List Sidebar */}
          <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)', overflowY: 'auto', padding: '12px' }}>
            {classes.map((cName, idx) => {
              const isH = details[idx]?.is_healthy
              const isSel = idx === selectedIdx
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    marginBottom: '6px',
                    cursor: 'pointer',
                    background: isSel ? 'rgba(52, 211, 153, 0.15)' : 'transparent',
                    border: isSel ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isH ? <ShieldCheck size={14} color="var(--cyan-400)" /> : <AlertTriangle size={14} color="var(--amber-400)" />}
                    <span style={{ fontSize: '13px', fontWeight: isSel ? '700' : '500', color: isSel ? '#fff' : 'var(--text-secondary)' }}>
                      {cName}
                    </span>
                  </div>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </div>
              )
            })}
          </div>

          {/* Details Content */}
          <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <span className={`severity-badge ${current.is_healthy ? 'severity-healthy' : 'severity-severe'}`}>
                {current.category}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginTop: '8px' }}>
                {current.name || classes[selectedIdx]}
              </h2>
              {current.scientific_name && (
                <p style={{ fontSize: '13px', color: 'var(--emerald-400)', fontStyle: 'italic' }}>
                  {current.scientific_name}
                </p>
              )}
            </div>

            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {current.description}
            </p>

            {current.symptoms && (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--emerald-400)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Symptoms & Field Signs
                </h4>
                <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {current.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {current.treatments && (
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--cyan-400)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Management & Treatments
                </h4>
                <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {current.treatments.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
