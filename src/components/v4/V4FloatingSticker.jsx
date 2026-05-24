import { useState, useRef } from 'react'

/**
 * V4FloatingSticker — A small draggable badge/sticker that can be repositioned
 * anywhere on the page. Uses pointer events for cross-device drag support.
 */
export default function V4FloatingSticker() {
  const [pos, setPos] = useState({ x: 80, y: 160 })
  const [dragging, setDragging] = useState(false)
  const offset = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e) => {
    e.preventDefault()
    e.target.setPointerCapture(e.pointerId)
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    }
    setDragging(true)
  }

  const handlePointerMove = (e) => {
    if (!dragging) return
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    })
  }

  const handlePointerUp = () => {
    setDragging(false)
  }

  return (
    <div
      className={`v4-sticker ${dragging ? 'is-dragging' : ''}`}
      style={{
        left: pos.x,
        top: pos.y,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="img"
      aria-label="Draggable V4 sticker"
    >
      <span className="v4-sticker__badge">V4</span>
      <span className="v4-sticker__sub">CHAOS</span>
    </div>
  )
}
