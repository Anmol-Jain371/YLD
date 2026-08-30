import React, { useState } from 'react'
import { Clipboard, X, ChevronRight, CheckCircle2, AlertOctagon } from 'lucide-react'

export function DiseaseCatalog({ diseases, isOpen, onClose }) {
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
        backgroundColor: 'rgba(6, 10, 7, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="lab-card"
        style={{
          width: '100%',
          maxWidth: '900px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card-hover)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid var(--border-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clipboard size={18} color="var(--forest-400)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-serif)' }}>
              Botanical Pathology Reference
            </h3>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '4px 8px' }}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', flex: 1, overflow: 'hidden' }}>
          {/* Class List Sidebar */}
          <div style={{ borderRight: '1px solid var(--border-card)', overflowY: 'auto', padding: '12px', background: '#111411' }}>
            {classes.map((cName, idx) => {
              const isH = details[idx]?.is_healthy
              const isSel = idx === selectedIdx
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedIdx(idx)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    background: isSel ? 'var(--forest-700)' : 'transparent',
                    border: isSel ? '1px solid var(--forest-500)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isH ? <CheckCircle2 size={13} color="var(--forest-400)" /> : <AlertOctagon size={13} color="var(--clay-400)" />}
                    <span style={{ fontSize: '12px', fontWeight: isSel ? '600' : '400', color: isSel ? '#fff' : 'var(--text-secondary)' }}>
                      {cName}
                    </span>
                  </div>
                  <ChevronRight size={12} color="var(--text-muted)" />
                </div>
              )
            })}
          </div>

          {/* Details Content */}
          <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className={`severity-badge ${current.is_healthy ? 'severity-healthy' : 'severity-severe'}`}>
                {current.category}
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginTop: '8px', fontFamily: 'var(--font-serif)' }}>
                {current.name || classes[selectedIdx]}
              </h2>
              {current.scientific_name && (
                <p style={{ fontSize: '12px', color: 'var(--forest-400)', fontStyle: 'italic', marginTop: '2px' }}>
                  {current.scientific_name}
                </p>
              )}
            </div>

            <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {current.description}
            </p>

            {current.symptoms && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: '600', color: 'var(--forest-400)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Symptoms & Field Signs
                </h4>
                <ul style={{ paddingLeft: '16px', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {current.symptoms.map((s, i) => <li key={i} style={{ lineHeight: '1.4' }}>{s}</li>)}
                </ul>
              </div>
            )}

            {current.treatments && (
              <div>
                <h4 style={{ fontSize: '11px', fontWeight: '600', color: 'var(--clay-400)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                  Recommended Agronomic Treatments
                </h4>
                <ul style={{ paddingLeft: '16px', fontSize: '12.5px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {current.treatments.map((t, i) => <li key={i} style={{ lineHeight: '1.4' }}>{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
