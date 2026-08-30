import React, { useState } from 'react'
import { CheckCircle, AlertTriangle, ShieldCheck, Activity, BookOpen, ChevronRight, Droplet, Sprout, AlertOctagon } from 'lucide-react'

export function PredictionCard({ prediction }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { class_name, confidence, is_healthy, probabilities, disease_info, gradcam } = prediction

  const sortedProbs = Object.entries(probabilities || {})
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="glass-panel" style={{ padding: '28px', width: '100%' }}>
      {/* Header with Classification Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              className={`severity-badge ${
                is_healthy ? 'severity-healthy' : gradcam?.severity_level?.includes('Severe') ? 'severity-severe' : 'severity-moderate'
              }`}
            >
              {is_healthy ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />}
              {is_healthy ? 'Healthy Palm Tissue' : disease_info?.category || 'Diseased Tissue'}
            </span>

            {gradcam && (
              <span className={`severity-badge ${is_healthy ? 'severity-healthy' : 'severity-moderate'}`}>
                <Activity size={14} /> Severity: {gradcam.severity_score_percent}% ({gradcam.severity_level})
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            {class_name}
          </h2>
          {disease_info?.scientific_name && (
            <p style={{ fontSize: '14px', color: 'var(--emerald-400)', fontStyle: 'italic', marginTop: '2px' }}>
              Pathogen / Cause: {disease_info.scientific_name}
            </p>
          )}
        </div>

        {/* Confidence Gauge */}
        <div style={{ textAlign: 'right', background: 'rgba(0, 0, 0, 0.4)', padding: '12px 18px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Model Confidence
          </p>
          <p style={{ fontSize: '28px', fontWeight: '800', color: confidence > 0.85 ? 'var(--emerald-400)' : 'var(--amber-400)', fontFamily: 'var(--font-mono)' }}>
            {(confidence * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
        <button
          className={`btn-secondary ${activeTab === 'overview' ? 'active' : ''}`}
          style={{
            borderColor: activeTab === 'overview' ? 'var(--emerald-400)' : 'transparent',
            background: activeTab === 'overview' ? 'rgba(52, 211, 153, 0.15)' : 'transparent'
          }}
          onClick={() => setActiveTab('overview')}
        >
          <BookOpen size={15} /> Symptoms & Diagnosis
        </button>
        <button
          className={`btn-secondary ${activeTab === 'treatment' ? 'active' : ''}`}
          style={{
            borderColor: activeTab === 'treatment' ? 'var(--emerald-400)' : 'transparent',
            background: activeTab === 'treatment' ? 'rgba(52, 211, 153, 0.15)' : 'transparent'
          }}
          onClick={() => setActiveTab('treatment')}
        >
          <Droplet size={15} /> Treatment & Control
        </button>
        <button
          className={`btn-secondary ${activeTab === 'probs' ? 'active' : ''}`}
          style={{
            borderColor: activeTab === 'probs' ? 'var(--emerald-400)' : 'transparent',
            background: activeTab === 'probs' ? 'rgba(52, 211, 153, 0.15)' : 'transparent'
          }}
          onClick={() => setActiveTab('probs')}
        >
          <Activity size={15} /> All Class Probabilities
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
            {disease_info?.description || 'No detailed description available for this category.'}
          </p>

          {disease_info?.symptoms && disease_info.symptoms.length > 0 && (
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--emerald-400)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Key Diagnostic Indicators
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {disease_info.symptoms.map((sym, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--emerald-400)', marginTop: '2px' }}>•</span>
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
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--cyan-400)', marginBottom: '10px', textTransform: 'uppercase' }}>
                Recommended Direct Measures
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {disease_info.treatments.map((tr, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', background: 'rgba(34, 211, 238, 0.06)', borderLeft: '3px solid var(--cyan-400)', borderRadius: '0 10px 10px 0', fontSize: '14px', color: 'var(--text-primary)' }}>
                    {tr}
                  </div>
                ))}
              </div>
            </div>
          )}

          {disease_info?.prevention && disease_info.prevention.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--emerald-400)', marginBottom: '10px', textTransform: 'uppercase' }}>
                Preventive & Cultural Practices
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {disease_info.prevention.map((pv, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', background: 'rgba(52, 211, 153, 0.06)', borderLeft: '3px solid var(--emerald-400)', borderRadius: '0 10px 10px 0', fontSize: '14px', color: 'var(--text-primary)' }}>
                    {pv}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'probs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedProbs.map(([cName, prob]) => {
            const isTop = cName === class_name
            return (
              <div key={cName} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: isTop ? '700' : '400', color: isTop ? 'var(--emerald-400)' : 'var(--text-secondary)' }}>
                    {cName}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: isTop ? 'var(--emerald-400)' : 'var(--text-muted)' }}>
                    {(prob * 100).toFixed(2)}%
                  </span>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${prob * 100}%`,
                      background: isTop
                        ? 'linear-gradient(90deg, var(--emerald-500), var(--emerald-400))'
                        : 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '3px',
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
