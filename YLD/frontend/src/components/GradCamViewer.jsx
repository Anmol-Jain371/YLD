import React, { useState } from 'react'
import { Eye, Layers, Flame, Activity } from 'lucide-react'

export function GradCamViewer({ originalImage, overlayImage, heatmapImage, severity }) {
  const [viewMode, setViewMode] = useState('overlay') // 'overlay' | 'heatmap'

  const activeCamImage = viewMode === 'overlay' ? (overlayImage || heatmapImage) : (heatmapImage || overlayImage)

  if (!originalImage && !activeCamImage) return null

  return (
    <div className="glass-card fade-up">
      <div className="glass-card-inner">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Visual Saliency & Heatmap
              </h3>
              <span className="badge badge-healthy" style={{ fontSize: '10px' }}>
                Grad-CAM XAI
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
              Neural network attention mapping over symptomatic plant tissue
            </p>
          </div>

          {/* View Mode Controls */}
          {overlayImage && heatmapImage && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className={`btn-secondary ${viewMode === 'overlay' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => setViewMode('overlay')}
              >
                <Layers size={13} /> Saliency Overlay
              </button>
              <button
                type="button"
                className={`btn-secondary ${viewMode === 'heatmap' ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '12px' }}
                onClick={() => setViewMode('heatmap')}
              >
                <Flame size={13} /> Jet Heatmap
              </button>
            </div>
          )}
        </div>

        {/* Visual Comparison Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Original Specimen */}
          {originalImage && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
              <img
                src={originalImage}
                alt="Original sample"
                style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(4,10,4,0.75)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Input Specimen
              </div>
            </div>
          )}

          {/* Grad-CAM Heatmap / Overlay */}
          {activeCamImage && (
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(168,197,160,0.25)', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
              <img
                src={activeCamImage}
                alt="Grad-CAM Saliency"
                style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(4,10,4,0.85)', backdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', color: 'var(--green-light)', border: '1px solid rgba(168,197,160,0.3)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Activity size={12} /> {viewMode === 'overlay' ? 'Neural Attention Overlay' : 'Raw Jet Heatmap'}
              </div>
            </div>
          )}
        </div>

        {/* Severity Metrics Bar */}
        {severity && (
          <div style={{ marginTop: '20px', padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Symptomatic Tissue Area
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: '600', color: 'var(--green-light)', marginTop: '2px' }}>
                {severity.severity_score_percent}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Clinical Severity Level
              </p>
              <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)', marginTop: '4px' }}>
                {severity.severity_level}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                Activation Threshold
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: 'var(--amber)', marginTop: '4px' }}>
                &gt; {severity.activation_threshold || '0.35'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
