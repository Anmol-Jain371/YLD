import React, { useState, useRef } from 'react'
import { Image as ImageIcon, Camera, RefreshCw } from 'lucide-react'

export function LeafUpload({ onImageSelected, isAnalyzing, selectedImage, onReset }) {
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true)
    else if (e.type === 'dragleave') setIsDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
    if (e.dataTransfer.files?.[0]?.type.startsWith('image/')) {
      onImageSelected(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) onImageSelected(e.target.files[0])
  }

  // Simple clean leaf shape: pointed at top, wide in middle, tapered at bottom
  const leafClip = `polygon(
    50% 0%,
    72% 6%,
    88% 18%,
    97% 35%,
    100% 52%,
    96% 68%,
    84% 82%,
    66% 93%,
    50% 100%,
    34% 93%,
    16% 82%,
    4% 68%,
    0% 52%,
    3% 35%,
    12% 18%,
    28% 6%
  )`

  return (
    <div className="leaf-upload-section">
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileChange} />

      {/* Leaf container */}
      <div style={{ position: 'relative', width: '260px', height: '360px', flexShrink: 0 }}>

        {/* Decorative SVG — outline, midrib, veins — drawn BEHIND the clipped zone */}
        <svg
          viewBox="0 0 260 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
        >
          {/* Leaf border outline — same shape as the clip polygon */}
          <polygon
            points="
              130,0
              187,22
              229,65
              252,126
              260,187
              250,245
              218,295
              172,335
              130,360
              88,335
              42,295
              10,245
              0,187
              8,126
              31,65
              73,22
            "
            fill="rgba(8,18,8,0.55)"
            stroke="rgba(168,197,160,0.28)"
            strokeWidth="1.5"
          />

          {/* Central midrib */}
          <line x1="130" y1="4" x2="130" y2="356" stroke="rgba(168,197,160,0.35)" strokeWidth="1.5" />

          {/* Lateral veins — right side, curving outward */}
          <path d="M 130,90  Q 185,108 218,115" stroke="rgba(168,197,160,0.14)" strokeWidth="1" fill="none" />
          <path d="M 130,140 Q 195,155 232,158" stroke="rgba(168,197,160,0.14)" strokeWidth="1" fill="none" />
          <path d="M 130,190 Q 196,202 228,200" stroke="rgba(168,197,160,0.14)" strokeWidth="1" fill="none" />
          <path d="M 130,240 Q 186,250 214,244" stroke="rgba(168,197,160,0.14)" strokeWidth="1" fill="none" />
          <path d="M 130,285 Q 170,293 190,286" stroke="rgba(168,197,160,0.10)" strokeWidth="1" fill="none" />

          {/* Lateral veins — left side (mirror) */}
          <path d="M 130,90  Q 75,108 42,115"  stroke="rgba(168,197,160,0.14)" strokeWidth="1" fill="none" />
          <path d="M 130,140 Q 65,155 28,158"  stroke="rgba(168,197,160,0.14)" strokeWidth="1" fill="none" />
          <path d="M 130,190 Q 64,202 32,200"  stroke="rgba(168,197,160,0.14)" strokeWidth="1" fill="none" />
          <path d="M 130,240 Q 74,250 46,244"  stroke="rgba(168,197,160,0.14)" strokeWidth="1" fill="none" />
          <path d="M 130,285 Q 90,293 70,286"  stroke="rgba(168,197,160,0.10)" strokeWidth="1" fill="none" />
        </svg>

        {/* Content area — clipped to the leaf polygon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: leafClip,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: selectedImage ? 'default' : 'pointer',
            textAlign: 'center',
            padding: selectedImage ? '0' : '40px 50px',
            background: isDragActive
              ? 'rgba(90,138,94,0.18)'
              : selectedImage
              ? 'transparent'
              : 'rgba(10,22,10,0.5)',
            transition: 'background 0.2s ease',
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !selectedImage && fileInputRef.current?.click()}
        >
          {selectedImage ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src={selectedImage.previewUrl}
                alt="Specimen"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(2,8,2,0.92) 0%, transparent 50%)',
                display: 'flex', alignItems: 'flex-end',
                padding: '28px 50px 32px',
                justifyContent: 'space-between', zIndex: 2
              }}>
                <div>
                  <p style={{ fontSize: '10.5px', fontWeight: '500', color: '#fff' }}>
                    {selectedImage.file.name.length > 18
                      ? selectedImage.file.name.slice(0, 15) + '…'
                      : selectedImage.file.name}
                  </p>
                  <p style={{ fontSize: '9.5px', color: 'var(--text-muted)', marginTop: '1px' }}>
                    {(selectedImage.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '3px 8px', fontSize: '10px' }}
                  onClick={(e) => { e.stopPropagation(); onReset() }}
                >
                  <RefreshCw size={10} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(90,138,94,0.12)',
                border: '1px solid rgba(90,138,94,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', marginBottom: '12px'
              }}>
                🌿
              </div>
              <p style={{
                fontFamily: 'var(--font-serif)', fontSize: '15px',
                fontWeight: '600', color: 'var(--text-primary)', marginBottom: '6px'
              }}>
                Drop image here
              </p>
              <p style={{
                fontSize: '11px', color: 'var(--text-muted)',
                lineHeight: '1.5', maxWidth: '150px'
              }}>
                Any arecanut palm tissue sample
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action buttons below the leaf */}
      {!selectedImage && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button type="button" className="btn-primary" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={14} /> Browse Files
          </button>
          <button type="button" className="btn-secondary" onClick={() => cameraInputRef.current?.click()}>
            <Camera size={14} /> Camera
          </button>
        </div>
      )}
    </div>
  )
}
