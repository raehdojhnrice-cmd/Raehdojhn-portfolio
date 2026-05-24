import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function V4LabSplatCanvas() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(20)
  const [isInverted, setIsInverted] = useState(false)
  const [brushMode, setBrushMode] = useState('additive') // additive | erase

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Initial fill
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const startDrawing = (e) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
  }

  const draw = (e) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (brushMode === 'additive') {
      ctx.strokeStyle = isInverted ? '#000' : '#fff'
      ctx.globalCompositeOperation = 'source-over'
    } else {
      ctx.strokeStyle = '#111'
      ctx.globalCompositeOperation = 'source-over'
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)

    // Add some noise/chaos
    if (Math.random() > 0.8) {
      ctx.fillStyle = ctx.strokeStyle
      ctx.fillRect(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 40, 2, 2)
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#111'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setIsInverted(false)
  }

  const toggleInvert = () => {
    setIsInverted(!isInverted)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-6 items-center justify-between pb-6 border-b border-white/5">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[8px] text-text-muted tracking-widest uppercase">BRUSH_SYS</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setBrushMode('additive')}
                className={`px-4 py-2 font-mono text-[9px] border transition-all ${brushMode === 'additive' ? 'bg-text-primary text-void border-text-primary' : 'border-border text-text-muted hover:border-text-primary'}`}
              >
                ADD
              </button>
              <button 
                onClick={() => setBrushMode('erase')}
                className={`px-4 py-2 font-mono text-[9px] border transition-all ${brushMode === 'erase' ? 'bg-text-primary text-void border-text-primary' : 'border-border text-text-muted hover:border-text-primary'}`}
              >
                DEL
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[8px] text-text-muted tracking-widest uppercase">CHAOS_MOD</span>
            <div className="flex gap-2">
              <button 
                onClick={toggleInvert}
                className={`px-4 py-2 font-mono text-[9px] border transition-all ${isInverted ? 'bg-nodear-red text-white border-nodear-red' : 'border-border text-text-muted hover:border-nodear-red'}`}
              >
                INVERT
              </button>
              <button 
                onClick={clearCanvas}
                className="px-4 py-2 font-mono text-[9px] border border-border text-text-muted hover:bg-accent-red hover:text-white hover:border-accent-red transition-all"
              >
                CLEAR
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-[200px] flex flex-col gap-2">
          <span className="font-mono text-[8px] text-text-muted tracking-widest uppercase">SIZE: {brushSize}PX</span>
          <input 
            type="range" 
            min="2" 
            max="120" 
            value={brushSize} 
            onChange={(e) => setBrushSize(parseInt(e.target.value))} 
            className="w-full accent-nodear-red bg-void border border-border h-1 appearance-none cursor-pointer"
          />
        </div>
      </div>

      <div className="relative group cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className={`w-full aspect-video bg-void border border-border shadow-2xl transition-all duration-700 ${isInverted ? 'invert' : ''}`}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseOut={stopDrawing}
        />
        
        {/* Technical Overlays */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none opacity-40">
          <span className="font-mono text-[8px] text-text-muted tracking-[0.4em] uppercase">INT_V4 / DRAW_SURFACE</span>
          <span className="font-mono text-[8px] text-text-muted tracking-[0.2em] uppercase">ID_0x{Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
        </div>

        <div className="absolute bottom-4 right-4 pointer-events-none opacity-40">
          <span className="font-mono text-[10px] text-text-muted">800 X 500 PX</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="font-mono text-[9px] text-text-muted tracking-widest uppercase">SIGNAL: ACTIVE</span>
        </div>
        <span className="font-mono text-[9px] text-text-muted opacity-40 uppercase tracking-widest">SPLAT_MODULE_v8.2_STABLE</span>
      </div>
    </div>
  )
}
