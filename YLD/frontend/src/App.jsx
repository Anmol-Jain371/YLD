import React, { useState, useEffect } from 'react'
import { LeafUpload } from './components/LeafUpload'
import { PredictionCard } from './components/PredictionCard'
import { GradCamViewer } from './components/GradCamViewer'
import { DiseaseCatalog } from './components/DiseaseCatalog'
import { Microscope, Activity, ShieldCheck, AlertCircle, Info, Clipboard, BookOpen, RefreshCw } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [systemHealth, setSystemHealth] = useState(null)
  const [diseaseCatalog, setDiseaseCatalog] = useState(null)
  const [isCatalogOpen, setIsCatalogOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  // Fetch backend status on mount
  useEffect(() => {
    fetchHealth()
    fetchDiseases()
  }, [])

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`)
      const data = await res.json()
      setSystemHealth(data)
    } catch (err) {
      console.warn('Backend not responding yet:', err)
      setSystemHealth({ status: 'offline', demo_mode: true })
    }
  }

  const fetchDiseases = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/diseases`)
      const data = await res.json()
      setDiseaseCatalog(data)
    } catch (err) {
      console.warn('Could not fetch disease catalog:', err)
    }
  }

  const handleImageSelected = (file) => {
    const previewUrl = URL.createObjectURL(file)
    setSelectedImage({ file, previewUrl })
    setPrediction(null)
    setErrorMsg(null)
  }

  const handleReset = () => {
    if (selectedImage?.previewUrl) {
      URL.revokeObjectURL(selectedImage.previewUrl)
    }
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

      const res = await fetch(`${API_BASE}/predict?generate_cam=true`, {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.detail || `Server returned error ${res.status}`)
      }

      const result = await res.json()
      setPrediction(result)
    } catch (err) {
      console.error('Diagnosis failed:', err)
      setErrorMsg(`Analysis failed: ${err.message}. Please check if the laboratory backend is active.`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          borderBottom: '1px solid var(--border-card)',
          background: 'rgba(12, 16, 13, 0.95)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: 'var(--forest-600)',
                border: '1px solid var(--forest-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(74, 112, 81, 0.1)'
              }}
            >
              <Microscope size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px', color: '#fff', fontFamily: 'var(--font-serif)' }}>
                AdikeScan
              </h1>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                Arecanut Palm Pathology Diagnostic Tool
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* System Status Pill */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                background: '#111512',
                border: '1px solid var(--border-card)',
                borderRadius: '4px',
                fontSize: '11px'
              }}
            >
              <div
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor:
                    systemHealth?.status === 'offline'
                      ? '#ef4444'
                      : systemHealth?.demo_mode
                      ? '#fbbf24'
                      : 'var(--forest-400)'
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>
                {systemHealth?.status === 'offline'
                  ? 'System Offline'
                  : systemHealth?.demo_mode
                  ? 'Specimen DB Loading'
                  : `Diagnostics Active (${systemHealth?.device?.toUpperCase() || 'CPU'})`}
              </span>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '12px' }}
              onClick={() => setIsCatalogOpen(true)}
            >
              <BookOpen size={13} /> Diagnostic Reference
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Intro Banner */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'rgba(74, 112, 81, 0.08)', border: '1px solid rgba(74, 112, 81, 0.2)', borderRadius: '4px', color: 'var(--forest-400)', fontSize: '12px', fontWeight: '500', marginBottom: '14px' }}>
            Botanical Pathology Report & Visual Saliency Mapping
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.5px', color: '#fff', marginBottom: '12px', fontFamily: 'var(--font-serif)' }}>
            Arecanut Palm Pathology Report
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '640px', margin: '0 auto' }}>
            Upload tissue samples (leaves, trunk, base, or fruit) to analyze symptomatic regions, generate saliency heatmaps, and load tailored agronomic treatments.
          </p>
        </div>

        {/* Upload Widget */}
        <section>
          <LeafUpload
            selectedImage={selectedImage}
            onImageSelected={handleImageSelected}
            onReset={handleReset}
            isAnalyzing={isAnalyzing}
          />

          {selectedImage && !prediction && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
              <button
                type="button"
                className="btn-primary"
                style={{ fontSize: '14px', padding: '12px 32px' }}
                disabled={isAnalyzing}
                onClick={runDiagnosis}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={15} className="spinning" /> Scanning tissue structure...
                  </>
                ) : (
                  <>
                    <Activity size={15} /> Run Specimen Analysis
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ padding: '14px 18px', background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '6px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Prediction Results & Grad-CAM Viewer */}
        {prediction && (
          <section style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <PredictionCard prediction={prediction} />

            {prediction.gradcam && (
              <GradCamViewer
                gradcam={prediction.gradcam}
                originalImageUrl={selectedImage?.previewUrl}
              />
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-card)', padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px' }}>
        <p>AdikeScan Laboratory Diagnostics • MobileNetV3-Small Pathology Classifier • Saliency Overlay Mapping</p>
      </footer>

      {/* Disease Catalog Reference Modal */}
      <DiseaseCatalog
        diseases={diseaseCatalog}
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  )
}
