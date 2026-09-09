'use client'

import React, { useEffect, useState } from 'react'

export interface LiveClockProps {
  className?: string
  showZone?: boolean
  [key: string]: unknown
}

export const LiveClock: React.FC<LiveClockProps> = ({
  className = '',
  showZone = true,
}) => {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState('--:--:--')
  const [date, setDate] = useState('—')

  useEffect(() => {
    let timeFormatter: Intl.DateTimeFormat | null = null
    let dateFormatter: Intl.DateTimeFormat | null = null

    try {
      timeFormatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    } catch {
      try {
        timeFormatter = new Intl.DateTimeFormat('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      } catch {
        timeFormatter = null
      }
    }

    try {
      dateFormatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    } catch {
      try {
        dateFormatter = new Intl.DateTimeFormat('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      } catch {
        dateFormatter = null
      }
    }

    const update = () => {
      const now = new Date()
      if (timeFormatter) {
        setTime(timeFormatter.format(now))
      } else {
        setTime(now.toLocaleTimeString())
      }
      if (dateFormatter) {
        setDate(dateFormatter.format(now).toUpperCase())
      } else {
        setDate(now.toLocaleDateString().toUpperCase())
      }
    }

    update()
    setMounted(true)

    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className={`bokengi-live-clock ${className}`.trim()}
      data-mounted={mounted ? 'true' : 'false'}
    >
      {showZone && (
        <div className="bokengi-live-clock__header">
          <span className="bokengi-live-clock__dot" aria-hidden="true" />
          <span className="bokengi-live-clock__zone">EUROPE / PARIS</span>
        </div>
      )}
      <div
        className="bokengi-live-clock__time"
        aria-live="polite"
        aria-label={`Heure actuelle à Paris : ${time}`}
      >
        {time}
      </div>
      <div className="bokengi-live-clock__date">
        {date}
      </div>
    </div>
  )
}

export default LiveClock