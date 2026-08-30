import React, { useState } from 'react'
import { Eye, Layers, Flame, Info, CheckCircle2, AlertCircle } from 'lucide-react'

export function GradCamViewer({ gradcam, originalImageUrl }) {
  const [viewMode, setViewMode] = useState('overlay') // 'overlay', 'heatmap', 'original', 'split'

  if (!gradcam) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Grad-CAM explainability not available for this prediction.</p>
      </div>
    )
  }

  const { overlay, heatmap, severity_score_percent, severity_level, activation_threshold } = gradcam

  return (
    <div className="glass-panel" style={{ padding: '28px', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Flame size={20} color="var(--emerald-400)" />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
              Phase 2 Tier 1: Grad-CAM Neural Explainability
            </h3>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            Gradient backpropagation through MobileNetV3-Small final conv layer (<code style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald-400)' }}>features[12]</code>)
          </p>
        </div>

        {/* View Mode Buttons */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: viewMode === 'overlay' ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
              borderColor: viewMode === 'overlay' ? 'var(--emerald-400)' : 'transparent'
            }}
            onClick={() => setViewMode('overlay')}
          >
            <Layers size={14} /> Overlay
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: viewMode === 'heatmap' ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
              borderColor: viewMode === 'heatmap' ? 'var(--emerald-400)' : 'transparent'
            }}
            onClick={() => setViewMode('heatmap')}
          >
            <Flame size={14} /> Heatmap
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              background: viewMode === 'original' ? 'rgba(52, 211, 153, 0.2)' : 'transparent',
              borderColor: viewMode === 'original' ? 'var(--emerald-400)' : 'transparent'
            }}
            onClick={() => setViewMode('original')}
          >
            <Eye size={14} /> Original
          </button>
        </div>
      </div>

      {/* Image Display Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#000',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
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
            alt="Grad-CAM visualization"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />

          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '4px 10px',
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--emerald-400)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {viewMode === 'overlay' ? 'Heatmap Overlay' : viewMode === 'heatmap' ? 'Jet Colormap Heatmap' : 'Input Image'}
          </div>
        </div>

        {/* Severity Metrics Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Estimated Tissue Severity Ratio
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontSize: '36px', fontWeight: '800', color: 'var(--emerald-400)', fontFamily: 'var(--font-mono)' }}>
                {severity_score_percent}%
              </span>
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                affected tissue area
              </span>
            </div>

            {/* Severity Progress Bar */}
            <div style={{ height: '8px', width: '100%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden', margin: '12px 0 8px' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(severity_score_percent, 100)}%`,
                  background:
                    severity_score_percent < 20
                      ? 'var(--emerald-400)'
                      : severity_score_percent < 45
                      ? 'var(--amber-400)'
                      : 'var(--rose-400)',
                  borderRadius: '4px',
                  transition: 'width 0.8s ease'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Mild (0-15%)</span>
              <span>Moderate (15-35%)</span>
              <span>Severe (&gt;35%)</span>
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.06)', borderLeft: '3px solid var(--emerald-400)', padding: '14px 16px', borderRadius: '0 12px 12px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Info size={15} color="var(--emerald-400)" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                Convolutional Attention Rationale
              </span>
            </div>
            <p style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              Red and yellow regions signify high gradient saliency where MobileNetV3-Small extracted discriminant features (such as yellowing margins, necrotic spots, or bore entry punctures).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
