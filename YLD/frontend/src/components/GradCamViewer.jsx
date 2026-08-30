import React, { useState } from 'react'
import { Eye, EyeOff, ZoomIn } from 'lucide-react'

export function GradCamViewer({ originalImage, gradcamImage, severity }) {
  const [showOverlay, setShowOverlay] = useState(false)

  if (!originalImage && !gradcamImage) return null

  return (
    <div className="glass-card fade-up">
      <div className="glass-card-inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Tissue Heat Map
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
              Model attention over diseased regions
            </p>
          </div>
          {gradcamImage && (
            <button className="btn-secondary" onClick={() => setShowOverlay(v => !v)}>
              {showOverlay ? <EyeOff size={13} /> : <Eye size={13} />}
              {showOverlay ? 'Original' : 'Attention Map'}
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: gradcamImage ? '1fr 1fr' : '1fr', gap: '12px' }}>
          {originalImage && !showOverlay && (
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--card-border)', position: 'relative' }}>
              <img src={originalImage} alt="Original sample" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '260px' }} />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', color: 'var(--text-muted)' }}>
                Sample Image
              </div>
            </div>
          )}

          {gradcamImage && (
            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(90,138,94,0.2)', position: 'relative' }}>
              <img src={gradcamImage} alt="Heat map" style={{ width: '100%', display: 'block', objectFit: 'cover', maxHeight: '260px' }} />
              <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', color: 'var(--green-light)' }}>
                Attention Map
              </div>
            </div>
          )}
        </div>

        {severity && (
          <div style={{ marginTop: '14px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Symptomatic Area', value: `${severity.severity_score_percent}%` },
              { label: 'Severity Level', value: severity.severity_level },
              { label: 'Peak Attention', value: severity.peak_intensity ?? 'N/A' }
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--green-light)', marginTop: '3px' }}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
