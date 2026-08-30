import React, { useState } from 'react'
import { AlertCircle, ShieldCheck, Activity, FileText, Leaf, BarChart2 } from 'lucide-react'

export function PredictionCard({ prediction }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { class_name, confidence, is_healthy, probabilities, disease_info, gradcam } = prediction
  const sortedProbs = Object.entries(probabilities || {}).sort((a, b) => b[1] - a[1])

  const severityBadgeClass = is_healthy
    ? 'badge badge-healthy'
    : (gradcam?.severity_score_percent > 35 ? 'badge badge-severe' : 'badge badge-moderate')

  return (
    <div className="glass-card fade-up">
      <div className="glass-card-inner">
        {/* Header */}
        <div className="diag-header">
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <span className={severityBadgeClass}>
                {is_healthy ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
                {is_healthy ? 'Healthy Tissue' : disease_info?.category || 'Diseased'}
              </span>
              {gradcam && !is_healthy && (
                <span className="badge badge-moderate">
                  <Activity size={12} /> {gradcam.severity_score_percent}% symptomatic · {gradcam.severity_level}
                </span>
              )}
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>
              {class_name}
            </h2>
            {disease_info?.scientific_name && (
              <p style={{ fontSize: '12px', color: 'var(--green-light)', fontStyle: 'italic', marginTop: '4px' }}>
                {disease_info.scientific_name}
              </p>
            )}
          </div>

          <div className="diag-confidence-box">
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
              Certainty
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: '26px', fontWeight: '500',
              color: confidence > 0.85 ? 'var(--green-light)' : 'var(--amber)'
            }}>
              {(confidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-row">
          {[
            { id: 'overview', label: 'Symptoms', icon: <FileText size={13} /> },
            { id: 'treatment', label: 'Treatment', icon: <Leaf size={13} /> },
            { id: 'probs', label: 'All Classes', icon: <BarChart2 size={13} /> }
          ].map(tab => (
            <button
              key={tab.id}
              className={`btn-secondary ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '14px', lineHeight: '1.65', color: 'var(--text-secondary)', fontWeight: '300' }}>
              {disease_info?.description || 'No description available.'}
            </p>
            {disease_info?.symptoms?.length > 0 && (
              <div>
                <div className="section-label">Field Indicators</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {disease_info.symptoms.map((s, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <span style={{ color: 'var(--green-mid)', flexShrink: 0, marginTop: '2px' }}>—</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'treatment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {disease_info?.treatments?.length > 0 && (
              <div>
                <div className="section-label">Treatment Measures</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {disease_info.treatments.map((t, i) => (
                    <div key={i} className="treatment-item">{t}</div>
                  ))}
                </div>
              </div>
            )}
            {disease_info?.prevention?.length > 0 && (
              <div>
                <div className="section-label">Prevention</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {disease_info.prevention.map((p, i) => (
                    <div key={i} className="prevention-item">{p}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'probs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sortedProbs.map(([name, prob]) => {
              const isTop = name === class_name
              return (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: isTop ? 'var(--green-light)' : 'var(--text-muted)', fontWeight: isTop ? '600' : '400' }}>{name}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: isTop ? 'var(--green-light)' : 'var(--text-muted)' }}>
                      {(prob * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${prob * 100}%`,
                        background: isTop ? 'var(--green-mid)' : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
