import React, { useState } from 'react'
import { AlertCircle, ShieldCheck, Activity, ClipboardList, ShieldAlert, BarChart2 } from 'lucide-react'

export function PredictionCard({ prediction }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { class_name, confidence, is_healthy, probabilities, disease_info, gradcam } = prediction

  const sortedProbs = Object.entries(probabilities || {})
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="lab-card" style={{ padding: '28px', width: '100%' }}>
      {/* Header with Classification Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span
              className={`severity-badge ${
                is_healthy ? 'severity-healthy' : gradcam?.severity_level?.includes('Severe') || gradcam?.severity_level?.includes('Critical') ? 'severity-severe' : 'severity-moderate'
              }`}
            >
              {is_healthy ? <ShieldCheck size={13} /> : <AlertCircle size={13} />}
              {is_healthy ? 'Healthy Palm Tissue' : disease_info?.category || 'Diseased Specimen'}
            </span>

            {gradcam && !is_healthy && (
              <span className="severity-badge" style={{ background: '#1d241f', color: 'var(--forest-400)', border: '1px solid var(--border-card)' }}>
                <Activity size={13} /> Symptomatic Area: {gradcam.severity_score_percent}% ({gradcam.severity_level})
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-serif)', letterSpacing: '-0.3px' }}>
            {class_name}
          </h2>
          {disease_info?.scientific_name && (
            <p style={{ fontSize: '13px', color: 'var(--forest-400)', fontStyle: 'italic', marginTop: '4px' }}>
              Pathogen / Cause: {disease_info.scientific_name}
            </p>
          )}
        </div>

        {/* Confidence Gauge */}
        <div style={{ textAlign: 'right', background: '#111512', padding: '12px 18px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            Diagnostic Certainty
          </p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: confidence > 0.85 ? 'var(--forest-400)' : 'var(--clay-400)', fontFamily: 'var(--font-mono)' }}>
            {(confidence * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-card)', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button
          className={`btn-secondary ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <ClipboardList size={14} /> Symptoms & Diagnosis
        </button>
        <button
          className={`btn-secondary ${activeTab === 'treatment' ? 'active' : ''}`}
          onClick={() => setActiveTab('treatment')}
        >
          <ShieldAlert size={14} /> Pathogen Management
        </button>
        <button
          className={`btn-secondary ${activeTab === 'probs' ? 'active' : ''}`}
          onClick={() => setActiveTab('probs')}
        >
          <BarChart2 size={14} /> Probability Distribution
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {disease_info?.description || 'No detailed description available for this category.'}
          </p>

          {disease_info?.symptoms && disease_info.symptoms.length > 0 && (
            <div style={{ background: '#111512', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--border-card)' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--forest-400)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Key Diagnostic Indicators
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {disease_info.symptoms.map((sym, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <span style={{ color: 'var(--forest-500)', marginTop: '2px' }}>•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'treatment' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {disease_info?.treatments && disease_info.treatments.length > 0 && (
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--clay-400)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Recommended Treatment Measures
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {disease_info.treatments.map((tr, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', background: 'rgba(214, 158, 107, 0.04)', borderLeft: '2.5px solid var(--clay-400)', borderRadius: '0 6px 6px 0', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {tr}
                  </div>
                ))}
              </div>
            </div>
          )}

          {disease_info?.prevention && disease_info.prevention.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--forest-400)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Preventive & Cultural Practices
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {disease_info.prevention.map((pv, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', background: 'rgba(74, 112, 81, 0.04)', borderLeft: '2.5px solid var(--forest-500)', borderRadius: '0 6px 6px 0', fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                    {pv}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'probs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedProbs.map(([cName, prob]) => {
            const isTop = cName === class_name
            return (
              <div key={cName} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ fontWeight: isTop ? '600' : '400', color: isTop ? 'var(--forest-400)' : 'var(--text-secondary)' }}>
                    {cName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '500', color: isTop ? 'var(--forest-400)' : 'var(--text-muted)' }}>
                    {(prob * 100).toFixed(2)}%
                  </span>
                </div>
                <div style={{ height: '4px', width: '100%', background: '#111512', borderRadius: '2px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${prob * 100}%`,
                      background: isTop
                        ? 'var(--forest-500)'
                        : 'var(--border-card)',
                      borderRadius: '2px',
                      transition: 'width 0.6s ease'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
