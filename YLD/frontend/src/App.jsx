import React, { useState, useEffect } from 'react'
import { LeafUpload } from './components/LeafUpload'
import { PredictionCard } from './components/PredictionCard'
import { GradCamViewer } from './components/GradCamViewer'
import { DiseaseCatalog } from './components/DiseaseCatalog'
import { Sprout, Activity, ShieldCheck, AlertCircle, Info, Sparkles, BookOpen, Cpu, RefreshCw } from 'lucide-react'

const API_BASE = 'http://localhost:8000'

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
      setErrorMsg(`Diagnosis error: ${err.message}. Please verify the backend is running.`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(10, 15, 13, 0.85)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--emerald-400), var(--emerald-600))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Sprout size={24} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.5px', color: '#fff' }}>
                AdikeScan
              </h1>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Arecanut (Adike) Plant Disease Diagnosis & Grad-CAM
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
                padding: '6px 14px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                fontSize: '12px'
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor:
                    systemHealth?.status === 'offline'
                      ? '#ef4444'
                      : systemHealth?.demo_mode
                      ? '#fbbf24'
                      : '#34d399'
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>
                {systemHealth?.status === 'offline'
                  ? 'API Offline'
                  : systemHealth?.demo_mode
                  ? 'Demo Mode (Untrained)'
                  : `Model Active (${systemHealth?.device?.toUpperCase() || 'GPU'})`}
              </span>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '13px' }}
              onClick={() => setIsCatalogOpen(true)}
            >
              <BookOpen size={15} /> 9 Diseases Guide
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Intro Banner */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '20px', color: 'var(--emerald-400)', fontSize: '13px', fontWeight: '600', marginBottom: '14px' }}>
            <Sparkles size={15} /> MobileNetV3-Small & PyTorch Grad-CAM Backpropagation
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px', color: '#fff', marginBottom: '12px' }}>
            Instant AI Pathology for Arecanut Palms
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Accurately detect Bud Borer, Mahali Koleroga, Yellow Leaf Disease, Stem Bleeding & Cracking with transparent visual explainability and tissue severity metrics.
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
                style={{ fontSize: '16px', padding: '14px 36px' }}
                disabled={isAnalyzing}
                onClick={runDiagnosis}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw size={18} className="spinning" /> Analyzing Neural Activations...
                  </>
                ) : (
                  <>
                    <Activity size={18} /> Run AI Diagnosis & Grad-CAM
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{ padding: '16px 20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
            <AlertCircle size={18} />
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
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        <p>AdikeScan AI Pathology • MobileNetV3-Small Classifier • PyTorch Grad-CAM Explainability</p>
      </footer>

      {/* Disease Catalog Modal */}
      <DiseaseCatalog
        diseases={diseaseCatalog}
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </div>
  )
}
