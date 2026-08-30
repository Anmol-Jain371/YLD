import React, { useState, useEffect } from 'react'
import { LeafUpload } from './components/LeafUpload'
import { PredictionCard } from './components/PredictionCard'
import { GradCamViewer } from './components/GradCamViewer'
import { DiseaseCatalog } from './components/DiseaseCatalog'
import { BookOpen, Activity, AlertCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ── SVG logo mark — a minimal leaf/frond icon ────────────────────────
function LeafIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C12 2 4 6 4 13C4 17.4 7.6 21 12 21C16.4 21 20 17.4 20 13C20 6 12 2 12 2Z"
        fill="rgba(90,138,94,0.35)"
        stroke="rgba(168,197,160,0.7)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <line x1="12" y1="2" x2="12" y2="21" stroke="rgba(168,197,160,0.5)" strokeWidth="1" />
      <path d="M12 7 Q16 10 18 13" stroke="rgba(168,197,160,0.25)" strokeWidth="0.8" fill="none" />
      <path d="M12 7 Q8 10 6 13"  stroke="rgba(168,197,160,0.25)" strokeWidth="0.8" fill="none" />
      <path d="M12 12 Q15 13.5 17 15" stroke="rgba(168,197,160,0.2)" strokeWidth="0.8" fill="none" />
      <path d="M12 12 Q9 13.5 7 15" stroke="rgba(168,197,160,0.2)" strokeWidth="0.8" fill="none" />
    </svg>
  )
}

// ── Loading overlay ──────────────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="loading-ring" />
        <div>
          <p className="loading-title">Analysing tissue sample</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Running the pathology model…
          </p>
        </div>
        <div className="loading-steps">
          <div className="loading-step">
            <div className="loading-step-dot" />
            <div className="loading-step-dot" />
            <div className="loading-step-dot" />
            <span>Pre-processing image · Model inference · Grad-CAM saliency</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Disease chips shown in the empty state ───────────────────────────
const DISEASE_HINTS = [
  { name: 'Healthy',            dot: ''         },
  { name: 'Yellow Leaf Disease', dot: 'dot-amber' },
  { name: 'Koleroga / Rot',      dot: 'dot-red'   },
  { name: 'Stem Bleeding',       dot: 'dot-red'   },
  { name: 'Bud Rot',             dot: 'dot-amber' },
  { name: 'Anabe / Spindle Bug', dot: 'dot-amber' },
  { name: 'Leaf Scorch',         dot: 'dot-red'   },
  { name: 'Mahali Koleroga',     dot: 'dot-amber' },
  { name: 'Crown Choke',         dot: 'dot-red'   },
]

export default function App() {
  const [selectedImage, setSelectedImage]   = useState(null)
  const [isAnalyzing, setIsAnalyzing]       = useState(false)
  const [prediction, setPrediction]         = useState(null)
  const [systemHealth, setSystemHealth]     = useState(null)
  const [diseaseCatalog, setDiseaseCatalog] = useState(null)
  const [isCatalogOpen, setIsCatalogOpen]   = useState(false)
  const [errorMsg, setErrorMsg]             = useState(null)

  useEffect(() => { fetchHealth(); fetchDiseases() }, [])

  const fetchHealth = async () => {
    try {
      const res  = await fetch(`${API_BASE}/health`)
      const data = await res.json()
      setSystemHealth(data)
    } catch {
      setSystemHealth({ status: 'offline', demo_mode: true })
    }
  }

  const fetchDiseases = async () => {
    try {
      const res  = await fetch(`${API_BASE}/api/diseases`)
      const data = await res.json()
      setDiseaseCatalog(data)
    } catch (err) { console.warn('Disease catalog unavailable:', err) }
  }

  const handleImageSelected = (file) => {
    setSelectedImage({ file, previewUrl: URL.createObjectURL(file) })
    setPrediction(null)
    setErrorMsg(null)
  }

  const handleReset = () => {
    if (selectedImage?.previewUrl) URL.revokeObjectURL(selectedImage.previewUrl)
    setSelectedImage(null)
    setPrediction(null)
    setErrorMsg(null)
  }

  const runDiagnosis = async () => {
    if (!selectedImage) return
    setIsAnalyzing(true)
    setErrorMsg(null)
    try {
      const formData = new FormData()
      formData.append('file', selectedImage.file)
      const res = await fetch(`${API_BASE}/predict?generate_cam=true`, { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server returned ${res.status}`)
      }
      setPrediction(await res.json())
    } catch (err) {
      setErrorMsg(`Analysis failed: ${err.message}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const statusColor =
    systemHealth?.status === 'offline' ? '#ef4444'
    : systemHealth?.demo_mode          ? '#fbbf24'
    : '#4ade80'

  const statusText =
    systemHealth?.status === 'offline' ? 'System Offline'
    : systemHealth?.demo_mode          ? 'Initializing'
    : 'System Ready'

  return (
    <>
      {/* ── Full-page cinematic background ── */}
      <div className="page-bg" />

      {/* ── Loading overlay ── */}
      {isAnalyzing && <LoadingOverlay />}

      <div className="page-content">

        {/* ────────────────────── NAVBAR ────────────────────── */}
        <nav className="navbar">
          <div className="nav-brand">
            <div className="nav-logo-mark">
              <LeafIcon size={18} />
            </div>
            <div>
              <div className="nav-title">AdikeScan</div>
              <div className="nav-subtitle">Arecanut Palm Disease Diagnostics</div>
            </div>
          </div>

          <div className="nav-right">
            <div className="status-dot">
              <div className="dot" style={{ backgroundColor: statusColor }} />
              <span>{statusText}</span>
            </div>
            <button type="button" className="btn-secondary" onClick={() => setIsCatalogOpen(true)}>
              <BookOpen size={13} /> Disease Reference
            </button>
          </div>
        </nav>

        {/* ────────────────────── HERO + UPLOAD (unified two-column) ────────────────────── */}
        <div className="hero-upload-grid">

          {/* LEFT — hero copy */}
          <div className="hero-col">
            <div className="hero-eyebrow">
              <span />
              Arecanut Palm · Pathogen Detection
              <span />
            </div>

            <h1 className="hero-title">
              Identify disease before it<br />
              <em>kills the harvest</em>
            </h1>

            <p className="hero-desc">
              Upload a photo of any arecanut palm tissue — leaf, trunk, base,
              or fruit bunch — and get an instant field diagnosis backed by a
              trained pathology model with visual attention mapping.
            </p>

            {/* Diagnose button lives here when image is selected */}
            {selectedImage && !prediction && (
              <button
                type="button"
                className="btn-primary"
                style={{ fontSize: '14px', padding: '13px 36px', alignSelf: 'flex-start' }}
                disabled={isAnalyzing}
                onClick={runDiagnosis}
              >
                <Activity size={15} /> Run Diagnosis
              </button>
            )}

            <div className="stat-strip">
              {[
                { value: '9',          label: 'Disease classes'       },
                { value: 'Real-time',  label: 'Field diagnosis'      },
                { value: 'Visual Map', label: 'Heatmap overlay'       },
              ].map(s => (
                <div className="stat-item" key={s.label}>
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — leaf upload */}
          <div className="upload-col">
            <LeafUpload
              selectedImage={selectedImage}
              onImageSelected={handleImageSelected}
              onReset={handleReset}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        {/* ────────────────────── ERROR ────────────────────── */}
        {errorMsg && (
          <div className="error-box" style={{ maxWidth: '700px', margin: '0 auto 28px', marginLeft: '32px', marginRight: '32px' }}>
            <AlertCircle size={16} style={{ flexShrink: 0, color: '#f87171' }} />
            {errorMsg}
          </div>
        )}

        {/* ────────────────────── EMPTY STATE ────────────────────── */}
        {!selectedImage && !prediction && (
          <div className="empty-state">
            <div className="empty-state-label">Conditions we detect</div>
            <div className="disease-chips">
              {DISEASE_HINTS.map(d => (
                <div className="disease-chip" key={d.name}>
                  <div className={`disease-chip-dot ${d.dot}`} />
                  {d.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ────────────────────── RESULTS ────────────────────── */}
        {prediction && (
          <div className="tool-section">
            <PredictionCard prediction={prediction} />
            {prediction.gradcam && (
              <GradCamViewer
                originalImage={selectedImage?.previewUrl}
                gradcamImage={prediction.gradcam?.cam_image
                  ? `data:image/jpeg;base64,${prediction.gradcam.cam_image}`
                  : null}
                severity={prediction.gradcam}
              />
            )}
          </div>
        )}

        {/* ────────────────────── FOOTER ────────────────────── */}
        <footer className="footer">
          <div className="footer-inner">
            {/* Brand column */}
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="nav-logo-mark" style={{ width: '28px', height: '28px' }}>
                  <LeafIcon size={15} />
                </div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  AdikeScan
                </span>
              </div>
              <p>
                A deep learning pathology tool for arecanut palm disease
                detection, built to support Indian agronomists and farmers
                with fast, accurate field diagnoses.
              </p>
            </div>

            {/* Detected diseases */}
            <div>
              <div className="footer-col-title">Disease Classes</div>
              <ul className="footer-list">
                <li>Yellow Leaf Disease</li>
                <li>Koleroga / Mahali Koleroga</li>
                <li>Stem Bleeding</li>
                <li>Bud Rot</li>
                <li>Anabe / Spindle Bug</li>
              </ul>
            </div>

            {/* Capabilities */}
            <div>
              <div className="footer-col-title">Diagnostic Capabilities</div>
              <ul className="footer-list">
                <li>Automated pathogen identification</li>
                <li>Visual attention saliency maps</li>
                <li>Rapid field sample analysis</li>
                <li>Agronomic treatment guidance</li>
                <li>9 arecanut disease classes</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2025 AdikeScan · COE Project · All rights reserved</span>
            <div className="footer-bottom-right">
              <span>Pathology Diagnostics</span>
              <span>Visual Saliency</span>
              <span>Palm Health</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Disease Catalog Modal */}
      <DiseaseCatalog
        diseases={diseaseCatalog}
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </>
  )
}
