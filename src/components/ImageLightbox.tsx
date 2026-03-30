import React, { useState, useEffect, useRef } from 'react'
import { X, ZoomIn, ZoomOut } from 'lucide-react'

interface ImageLightboxProps {
    src: string
    alt: string
    onClose: () => void
}

export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
    const [scale, setScale] = useState(1)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    // Pinch to zoom state
    const [initialDistance, setInitialDistance] = useState<number | null>(null)
    const [lastScale, setLastScale] = useState(1)

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden' // Prevent scrolling
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [onClose])

    const handleDoubleClick = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault()
        if (scale > 1) {
            setScale(1)
            setPosition({ x: 0, y: 0 })
        } else {
            setScale(2.5)
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale <= 1) return
        setIsDragging(true)
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || scale <= 1) return
        const newX = e.clientX - dragStart.x
        const newY = e.clientY - dragStart.y
        setPosition({ x: newX, y: newY })
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    // Touch handlers for pinch to zoom and pan
    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            )
            setInitialDistance(distance)
            setLastScale(scale)
        } else if (e.touches.length === 1 && scale > 1) {
            setIsDragging(true)
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            })
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && initialDistance !== null) {
            const distance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            )
            const newScale = Math.min(Math.max((distance / initialDistance) * lastScale, 1), 5)
            setScale(newScale)
            if (newScale === 1) setPosition({ x: 0, y: 0 })
        } else if (e.touches.length === 1 && isDragging && scale > 1) {
            const newX = e.touches[0].clientX - dragStart.x
            const newY = e.touches[0].clientY - dragStart.y
            setPosition({ x: newX, y: newY })
        }
    }

    const handleTouchEnd = () => {
        setInitialDistance(null)
        setIsDragging(false)
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                cursor: scale > 1 ? 'grab' : 'auto',
                touchAction: 'none',
            }}
            onClick={(e) => e.target === containerRef.current && onClose()}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Controls */}
            <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                display: 'flex',
                gap: '1rem',
                zIndex: 10000,
            }}>
                <button
                    onClick={() => setScale(prev => Math.min(prev + 0.5, 5))}
                    style={controlBtnStyle}
                    aria-label="Zoom In"
                >
                    <ZoomIn size={24} />
                </button>
                <button
                    onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }) }}
                    style={controlBtnStyle}
                    aria-label="Reset Zoom"
                >
                    <ZoomOut size={24} />
                </button>
                <button
                    onClick={onClose}
                    style={controlBtnStyle}
                    aria-label="Close"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Image Container */}
            <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onDoubleClick={handleDoubleClick}
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                }}
            >
                <img
                    ref={imageRef}
                    src={src}
                    alt={alt}
                    draggable={false}
                    style={{
                        maxWidth: '95%',
                        maxHeight: '95%',
                        objectFit: 'contain',
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                    }}
                />
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lightbox-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    )
}

const controlBtnStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    width: '3rem',
    height: '3rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(4px)',
    transition: 'all 0.2s',
}
