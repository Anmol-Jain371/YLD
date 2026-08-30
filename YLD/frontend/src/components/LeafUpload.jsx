import React, { useState, useRef } from 'react'
import { UploadCloud, Image as ImageIcon, Camera, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react'

export function LeafUpload({ onImageSelected, isAnalyzing, selectedImage, onReset }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        onImageSelected(file)
      }
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0])
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div
        className={`leaf-widget-container ${isDragActive ? 'drag-active' : ''} ${selectedImage ? 'has-image' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedImage && fileInputRef.current?.click()}
      >
        {selectedImage ? (
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img
              src={selectedImage.previewUrl}
              alt="Selected plant"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '24px'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '20px',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                  {selectedImage.file.name.length > 25 ? selectedImage.file.name.slice(0, 22) + '...' : selectedImage.file.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {(selectedImage.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onReset()
                }}
              >
                <RefreshCw size={14} /> Change
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', pointerEvents: 'none' }}>
            {/* SVG Decorative Leaf Veins */}
            <div style={{ marginBottom: '16px', color: 'var(--emerald-400)' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
              Drop Leaf / Plant Photo Here
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '260px', margin: '0 auto 16px' }}>
              Drag and drop an arecanut leaf, trunk, bunch, or foot image, or browse from device
            </p>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(52, 211, 153, 0.15)', borderRadius: '20px', color: 'var(--emerald-400)', fontSize: '12px', fontWeight: '600' }}>
              <Sparkles size={14} /> 9 Disease Classes Supported
            </div>
          </div>
        )}
      </div>

      {!selectedImage && (
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={18} /> Browse Photos
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={18} /> Take Photo
          </button>
        </div>
      )}
    </div>
  )
}
