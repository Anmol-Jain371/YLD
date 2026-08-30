import React, { useState } from 'react'
import { Clipboard, X, ChevronRight, CheckCircle2, AlertOctagon } from 'lucide-react'

export function DiseaseCatalog({ diseases, isOpen, onClose }) {
  const [selectedIdx, setSelectedIdx] = useState(0)

  if (!isOpen) return null

  const classes = diseases?.classes || []
  const details = diseases?.details || {}
  const current = details[selectedIdx] || {}

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clipboard size={16} color="var(--green-light)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)' }}>
              Disease Reference Library
            </h3>
          </div>
          <button type="button" className="btn-secondary" style={{ padding: '4px 8px' }} onClick={onClose}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Sidebar */}
          <div className="modal-sidebar">
            {classes.map((cName, idx) => {
              const isH = details[idx]?.is_healthy
              const isSel = idx === selectedIdx
              return (
                <div
                  key={idx}
                  className={`modal-sidebar-item ${isSel ? 'selected' : ''}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isH
                      ? <CheckCircle2 size={12} color="var(--green-mid)" />
                      : <AlertOctagon size={12} color="var(--amber)" />}
                    <span style={{ fontSize: '12px', fontWeight: isSel ? '600' : '400', color: isSel ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                      {cName}
                    </span>
                  </div>
                  <ChevronRight size={11} color="var(--text-muted)" />
                </div>
              )
            })}
          </div>

          {/* Detail */}
          <div className="modal-detail">
            <div>
              <span className={`badge ${current.is_healthy ? 'badge-healthy' : 'badge-moderate'}`} style={{ marginBottom: '10px', display: 'inline-flex' }}>
                {current.category || 'Disease'}
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2', marginTop: '8px' }}>
                {current.name || classes[selectedIdx]}
              </h2>
              {current.scientific_name && (
                <p style={{ fontSize: '12px', color: 'var(--green-light)', fontStyle: 'italic', marginTop: '4px' }}>
                  {current.scientific_name}
                </p>
              )}
            </div>

            <p style={{ fontSize: '13.5px', lineHeight: '1.65', color: 'var(--text-secondary)', fontWeight: '300' }}>
              {current.description}
            </p>

            {current.symptoms?.length > 0 && (
              <div>
                <div className="section-label">Field Symptoms</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {current.symptoms.map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--green-mid)', flexShrink: 0 }}>—</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {current.treatments?.length > 0 && (
              <div>
                <div className="section-label">Agronomic Treatments</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {current.treatments.map((t, i) => (
                    <div key={i} className="treatment-item">{t}</div>
                  ))}
                </div>
              </div>
            )}

            {current.prevention?.length > 0 && (
              <div>
                <div className="section-label">Prevention</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {current.prevention.map((p, i) => (
                    <div key={i} className="prevention-item">{p}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
