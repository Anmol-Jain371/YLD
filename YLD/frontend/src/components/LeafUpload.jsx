import React, { useState, useRef } from 'react'
import { Microscope, Image as ImageIcon, Camera, RefreshCw } from 'lucide-react'

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
        className={`specimen-mount-container ${isDragActive ? 'drag-active' : ''} ${selectedImage ? 'has-image' : ''}`}
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
              alt="Mounted specimen"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '20px',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#fff', fontFamily: 'var(--font-sans)' }}>
                  {selectedImage.file.name.length > 25 ? selectedImage.file.name.slice(0, 22) + '...' : selectedImage.file.name}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {(selectedImage.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px 10px', fontSize: '11px' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onReset()
                }}
              >
                <RefreshCw size={12} /> Replace Specimen
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px', pointerEvents: 'none' }}>
            {/* Minimalist Slide Mount Visual */}
            <div style={{ marginBottom: '16px', color: 'var(--forest-500)', display: 'flex', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="3" x2="12" y2="21" strokeDasharray="3 3" />
                <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="3 3" />
              </svg>
            </div>
            
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#fff', fontFamily: 'var(--font-serif)' }}>
              Mount Specimen Image
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '280px', margin: '0 auto 16px', lineHeight: '1.5' }}>
              Drag and drop an arecanut leaf, trunk, bunch, or foot image, or browse local files
            </p>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: 'var(--forest-700)', border: '1px solid var(--forest-600)', borderRadius: '4px', color: 'var(--forest-400)', fontSize: '11px', fontWeight: '500' }}>
              <Microscope size={13} /> 9 Pathology Classes
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
            <ImageIcon size={16} /> Select File
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={16} /> Capture Specimen
          </button>
        </div>
      )}
    </div>
  )
}
