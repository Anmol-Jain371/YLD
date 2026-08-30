import React, { useState } from 'react'
import { Eye, Layers, Flame, Info } from 'lucide-react'

export function GradCamViewer({ gradcam, originalImageUrl }) {
  const [viewMode, setViewMode] = useState('overlay') // 'overlay', 'heatmap', 'original'

  if (!gradcam) {
    return (
      <div className="lab-card" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Saliency mapping not available for this prediction.</p>
      </div>
    )
  }

  const { overlay, heatmap, severity_score_percent, severity_level } = gradcam

  return (
    <div className="lab-card" style={{ padding: '28px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Flame size={18} color="var(--forest-400)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-serif)' }}>
              Visual Saliency & Tissue Mapping
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
            Visualizes target tissue attention grids extracted from the final convolutional layer of the model
          </p>
        </div>

        {/* View Mode Buttons */}
        <div style={{ display: 'flex', background: '#111512', padding: '3px', borderRadius: '8px', gap: '2px', border: '1px solid var(--border-card)' }}>
          <button
            type="button"
            className={`btn-secondary ${viewMode === 'overlay' ? 'active' : ''}`}
            style={{ padding: '5px 10px', fontSize: '11px', border: 'none', borderRadius: '6px' }}
            onClick={() => setViewMode('overlay')}
          >
            <Layers size={13} /> Overlay
          </button>
          <button
            type="button"
            className={`btn-secondary ${viewMode === 'heatmap' ? 'active' : ''}`}
            style={{ padding: '5px 10px', fontSize: '11px', border: 'none', borderRadius: '6px' }}
            onClick={() => setViewMode('heatmap')}
          >
            <Flame size={13} /> Heatmap
          </button>
          <button
            type="button"
            className={`btn-secondary ${viewMode === 'original' ? 'active' : ''}`}
            style={{ padding: '5px 10px', fontSize: '11px', border: 'none', borderRadius: '6px' }}
            onClick={() => setViewMode('original')}
          >
            <Eye size={13} /> Specimen
          </button>
        </div>
      </div>

      {/* Image Display Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#0a0d0a',
            border: '1px solid var(--border-card)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <img
            src={
              viewMode === 'overlay'
                ? overlay
                : viewMode === 'heatmap'
                ? heatmap
                : originalImageUrl
            }
            alt="Diagnostic visualization"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />

          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '3px 8px',
              background: 'rgba(12, 16, 13, 0.85)',
              border: '1px solid var(--border-card)',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '500',
              color: 'var(--forest-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {viewMode === 'overlay' ? 'Heatmap Overlay' : viewMode === 'heatmap' ? 'Jet Spectrum Grid' : 'Raw Specimen'}
          </div>
        </div>

        {/* Severity Metrics Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#111512', padding: '20px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Symptomatic Tissue Coverage
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--forest-400)', fontFamily: 'var(--font-mono)' }}>
                {severity_score_percent}%
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                affected surface area
              </span>
            </div>

            {/* Severity Progress Bar */}
            <div className="progress-bar-track">
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(severity_score_percent, 100)}%`,
                  background:
                    severity_score_percent < 15
                      ? 'var(--forest-500)'
                      : severity_score_percent < 35
                      ? 'var(--clay-500)'
                      : 'var(--rust-400)',
                  transition: 'width 0.8s ease'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
              <span>Mild (&lt;15%)</span>
              <span>Moderate (15-35%)</span>
              <span>Severe (&gt;35%)</span>
            </div>
          </div>

          <div style={{ background: 'rgba(74, 112, 81, 0.04)', borderLeft: '2.5px solid var(--forest-500)', padding: '14px 16px', borderRadius: '0 8px 8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Info size={14} color="var(--forest-400)" />
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>
                Diagnostic Saliency Insights
              </span>
            </div>
            <p style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              The colored spectrum highlights specific regions where the model detected anomalies (such as necrosis, margin discolouration, tissue cracking, or exit holes). Warm red/orange areas indicate major diagnostic focus.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
