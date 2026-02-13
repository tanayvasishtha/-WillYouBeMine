'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from './ui/button'

const rejectionMessages = [
  { text: "Wait... are you sure? 🥺 My heart is breaking a little...", hearts: 10, yesSize: 1.1, noSize: 1.0 },
  { text: "But... but we had such a good story! Give me another chance? 💔", hearts: 20, yesSize: 1.25, noSize: 0.95 },
  { text: "Okay okay, I'll try harder! What if I said pretty please? 🥹✨", hearts: 30, yesSize: 1.4, noSize: 0.9 },
  { text: "You're really making me work for this, huh? I respect that... but also, please? 😭💕", hearts: 50, yesSize: 1.6, noSize: 0.85 },
  { text: "I'm not giving up on us! I'll wait as long as it takes! 💗💗💗", hearts: 75, yesSize: 1.8, noSize: 0.8 },
  { text: "My heart is doing backflips! Can you hear it? *THUMP THUMP THUMP* 💓", hearts: 100, yesSize: 2.0, noSize: 0.7 },
  { text: "You know you want to say yes... I can feel it! We both can! 💝", hearts: 125, yesSize: 2.2, noSize: 0.6 },
  { text: "I'm literally melting over here! Is this what true love feels like?! 🫠❤️‍🔥", hearts: 150, yesSize: 2.5, noSize: 0.5 },
  { text: "One more 'no' and I'm just gonna assume you're playing hard to get! 😤💘", hearts: 200, yesSize: 2.8, noSize: 0.4 },
  { text: "Nevermind, you sussy baka! 😏 I know you need me, so I'm just gonna accept it for both of us! We're Valentines now. No takebacks! 💕✨", hearts: 300, yesSize: 3.0, noSize: 0 }
]

export default function ValentineStory() {
  const [currentChapter, setCurrentChapter] = useState(0)
  const [rejectionCount, setRejectionCount] = useState(0)
  const [questionText, setQuestionText] = useState("Will you be my Valentine? ❤️")
  const [yesScale, setYesScale] = useState(1)
  const [noScale, setNoScale] = useState(1)
  const [showVictory, setShowVictory] = useState(false)
  const [shake, setShake] = useState(false)
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 })
  const [isNoHoverable, setIsNoHoverable] = useState(false)
  const [startStory, setStartStory] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const heartbeatCleanupRef = useRef<(() => void) | null>(null)
  const confettiCleanupRef = useRef<(() => void) | null>(null)

  const chapters = [
    {
      title: "Our Story Begins 🌟",
      content: [
        "Once upon a time...",
        "something extraordinary happened.",
        "Two hearts found each other.",
        "Let me tell you our story..."
      ],
      intensity: 1,
      hearts: 5
    },
    {
      title: "The First Spark ✨",
      content: [
        "Do you remember that moment?",
        "When our eyes met and everything made sense?",
        "Your smile lit up my entire world.",
        "And I knew... I just knew."
      ],
      intensity: 2,
      hearts: 15
    },
    {
      title: "Growing Together 🌱",
      content: [
        "Every day with you is an adventure.",
        "From silly jokes to deep conversations,",
        "you've become my favorite person.",
        "You noticed. You cared. You stayed.",
        "And my heart fell deeper."
      ],
      intensity: 3,
      hearts: 30
    },
    {
      title: "Little Moments 💕",
      content: [
        "It's the little things...",
        "How you remember my coffee order.",
        "The way you laugh at my terrible jokes.",
        "How you make every day feel special.",
        "These moments built something beautiful."
      ],
      intensity: 4,
      hearts: 50
    },
    {
      title: "Right Now 💫",
      content: [
        "Standing here with my heart racing,",
        "I can't hold it in anymore.",
        "You're not just someone special.",
        "You're everything.",
        "And there's something I need to ask you..."
      ],
      intensity: 5,
      hearts: 100
    }
  ]

  const [autoAdvance, setAutoAdvance] = useState(true)

  useEffect(() => {
    if (startStory && currentChapter < chapters.length - 1 && autoAdvance) {
      const timer = setTimeout(() => {
        setCurrentChapter(prev => prev + 1)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [currentChapter, startStory, chapters.length, autoAdvance])

  useEffect(() => {
    if (currentChapter < chapters.length && startStory) {
      const chapter = chapters[currentChapter]
      spawnHearts(chapter.hearts)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter, startStory])

  const goToNextChapter = () => {
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(prev => prev + 1)
      setAutoAdvance(true)
    } else {
      setCurrentChapter(chapters.length)
    }
  }

  const goToPrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1)
      setAutoAdvance(false)
    }
  }

  const spawnHearts = (count: number) => {
    if (typeof document === 'undefined') return
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div')
      heart.className = 'floating-heart'
      heart.setAttribute('aria-hidden', 'true')
      heart.innerHTML = '❤️'
      heart.style.left = Math.random() * 100 + '%'
      heart.style.animationDuration = (2 + Math.random() * 2) + 's'
      heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem'
      document.body.appendChild(heart)
      setTimeout(() => heart.remove(), 4000)
    }
  }

  useEffect(() => {
    return () => {
      heartbeatCleanupRef.current?.()
    }
  }, [])

  const playHeartbeat = (bpm: number): (() => void) | void => {
    if (typeof window === 'undefined') return

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 100
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)

      const interval = 60000 / bpm
      const beatInterval = setInterval(() => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()

        osc.connect(gain)
        gain.connect(audioContext.destination)

        osc.frequency.value = 100
        osc.type = 'sine'

        gain.gain.setValueAtTime(0, audioContext.currentTime)
        gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

        osc.start(audioContext.currentTime)
        osc.stop(audioContext.currentTime + 0.1)
      }, interval)

      const timeoutId = setTimeout(() => clearInterval(beatInterval), 5000)
      return () => {
        clearInterval(beatInterval)
        clearTimeout(timeoutId)
      }
    } catch (e) {
      console.log('Audio not available')
    }
  }

  const handleNoClick = () => {
    const count = rejectionCount

    if (count >= 10) {
      handleYesClick()
      return
    }

    const message = rejectionMessages[count]
    setQuestionText(message.text)
    setYesScale(message.yesSize)
    setNoScale(message.noSize)
    spawnHearts(message.hearts)

    if (count >= 3) {
      const bpm = 60 + (count - 2) * 30
      const cleanup = playHeartbeat(Math.min(bpm, 120))
      if (cleanup) heartbeatCleanupRef.current = cleanup
    }

    if (count >= 5) {
      setIsNoHoverable(true)
    }

    if (count >= 7) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }

    setRejectionCount(count + 1)
  }

  const handleNoHover = () => {
    if (isNoHoverable) {
      const maxX = 200
      const maxY = 200
      setNoButtonPosition({
        x: (Math.random() - 0.5) * maxX,
        y: (Math.random() - 0.5) * maxY
      })
    }
  }

  const handleYesClick = () => {
    spawnHearts(500)
    setShowVictory(true)
    setTimeout(() => {
      createConfetti()
    }, 500)
  }

  const createConfetti = () => {
    confettiCleanupRef.current?.()
    const duration = 5000
    const animationEnd = Date.now() + duration
    const colors = ['#FFB6C1', '#E6E6FA', '#FFD700', '#FF69B4', '#DDA0DD']
    const timeouts: ReturnType<typeof setTimeout>[] = []

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      const particleCount = 50
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div')
        particle.className = 'confetti-particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.background = colors[Math.floor(Math.random() * colors.length)]
        particle.style.animationDuration = randomInRange(2, 4) + 's'
        document.body.appendChild(particle)
        timeouts.push(setTimeout(() => {
          particle.remove()
        }, 4000))
      }
    }, 200)

    const timeoutId = setTimeout(() => {
      clearInterval(interval)
    }, duration)

    const cleanup = () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
      timeouts.forEach(clearTimeout)
      document.querySelectorAll('.confetti-particle').forEach((el) => el.remove())
      confettiCleanupRef.current = null
    }
    confettiCleanupRef.current = cleanup
  }

  useEffect(() => {
    return () => confettiCleanupRef.current?.()
  }, [])

  const shareStory = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Will You Be My Valentine?',
          text: 'Check out this adorable Valentine\'s Day message! 💕',
          url: window.location.href
        })
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    } else {
      if (typeof window !== 'undefined') {
        window.alert('Share this link with someone special! 💕')
      }
    }
  }

  if (!startStory) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden">
        <BackgroundAnimations />
        <div className="text-center z-10 space-y-8 animate-in fade-in duration-1000 px-4">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-primary" style={{ fontFamily: 'var(--font-quicksand)' }}>
            💕
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-foreground" style={{ fontFamily: 'var(--font-quicksand)' }}>
            A Special Message For You
          </p>
          <Button
            onClick={() => setStartStory(true)}
            size="lg"
            className="text-lg md:text-xl px-6 md:px-8 py-4 md:py-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full animate-pulse"
          >
            Click to Start 💌
          </Button>
        </div>
      </div>
    )
  }

  if (showVictory) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background overflow-hidden p-4">
        <BackgroundAnimations />
        <div className="text-center z-10 space-y-6 md:space-y-8 animate-in fade-in duration-1000 px-4 max-w-2xl">
          <div className="text-6xl md:text-8xl lg:text-9xl animate-bounce">
            🐕🌸🐕
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary animate-in slide-in-from-bottom duration-500" style={{ fontFamily: 'var(--font-quicksand)' }}>
            🎉 I KNEW IT! 🎉
          </h1>
          <p className="text-xl md:text-3xl lg:text-4xl text-foreground animate-in slide-in-from-bottom duration-700">
            {"We're perfect together! 💕"}
          </p>
          <p className="text-lg md:text-2xl lg:text-3xl text-muted-foreground animate-in slide-in-from-bottom duration-900">
            Happy Valentine&apos;s Day!
          </p>
          <Button
            onClick={shareStory}
            size="lg"
            className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full animate-in slide-in-from-bottom duration-1000"
          >
            Share Our Love Story 💌
          </Button>
        </div>
      </div>
    )
  }

  if (currentChapter >= chapters.length) {
    return (
      <div ref={containerRef} className={`fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden pt-20 pb-8 ${shake ? 'animate-shake' : ''}`}>
        <BackgroundAnimations />
        <SpotifyBar />

        <div className="text-center z-10 space-y-8 md:space-y-12 px-4 max-w-4xl w-full">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary animate-pulse text-balance px-2"
            style={{
              fontFamily: 'var(--font-quicksand)',
              textShadow: '0 0 30px rgba(255, 182, 193, 0.6)',
              filter: 'drop-shadow(0 0 20px rgba(255, 182, 193, 0.5))'
            }}
          >
            {questionText}
          </h1>

          <div className="flex gap-4 md:gap-6 justify-center items-center flex-wrap px-2">
            <Button
              onClick={handleYesClick}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg md:text-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl animate-pulse rounded-full"
              style={{
                transform: `scale(${Math.min(yesScale, 2)})`,
                minWidth: `${Math.min(200 * yesScale, 300)}px`,
                minHeight: `${Math.min(60 * yesScale, 90)}px`,
              }}
            >
              YES! 💖
            </Button>

            {noScale > 0 && (
              <Button
                onClick={handleNoClick}
                onMouseEnter={handleNoHover}
                onTouchStart={handleNoHover}
                variant="outline"
                size="lg"
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground text-lg md:text-xl font-bold transition-all duration-300 border-2 rounded-full"
                style={{
                  transform: `scale(${noScale}) translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
                  minWidth: `${200 * noScale}px`,
                  minHeight: `${60 * noScale}px`,
                }}
              >
                No 😢
              </Button>
            )}
          </div>

          <ProgressIndicator current={5} total={5} />

          <div className="mt-6 md:mt-8">
            <Button
              onClick={() => {
                setCurrentChapter(chapters.length - 1)
                setRejectionCount(0)
                setQuestionText("Will you be my Valentine? ❤️")
                setYesScale(1)
                setNoScale(1)
                setNoButtonPosition({ x: 0, y: 0 })
                setIsNoHoverable(false)
                setAutoAdvance(false)
              }}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground text-sm md:text-base"
            >
              ← Go Back to Story
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const chapter = chapters[currentChapter]
  const intensity = chapter.intensity

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background overflow-hidden pt-20 pb-8">
      <BackgroundAnimations />
      <SpotifyBar />

      {currentChapter <= 1 && (
        <div className="fixed top-[5.5rem] right-4 md:right-8 z-50 animate-bounce">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl rotate-[-30deg]">↖</span>
            <p className="text-xs md:text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap" style={{ fontFamily: 'var(--font-quicksand)' }}>
              Play music!
            </p>
          </div>
        </div>
      )}

      <div
        className="text-center z-10 space-y-4 md:space-y-6 px-4 max-w-2xl md:max-w-3xl w-full animate-in fade-in duration-1000 overflow-y-auto max-h-[calc(100vh-6rem)]"
        style={{
          filter: intensity >= 4 ? 'drop-shadow(0 0 20px rgba(255, 182, 193, 0.4))' : 'none',
        }}
      >
        <h2
          className={`text-2xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 md:mb-8 text-balance ${intensity >= 3 ? 'animate-pulse' : ''}`}
          style={{
            fontFamily: 'var(--font-quicksand)',
            textShadow: intensity >= 4 ? '0 0 20px rgba(255, 182, 193, 0.5)' : 'none',
          }}
        >
          {chapter.title}
        </h2>

        <div className="space-y-3 md:space-y-4">
          {chapter.content.map((line, index) => (
            <p
              key={index}
              className="text-lg md:text-xl lg:text-2xl text-foreground leading-relaxed animate-in fade-in text-pretty"
              style={{
                animationDelay: `${index * 200}ms`,
                fontFamily: 'var(--font-nunito)',
                opacity: 0.8 + (intensity * 0.04),
                textShadow: intensity >= 5 ? '0 0 10px rgba(255, 182, 193, 0.3)' : 'none'
              }}
            >
              {line}
            </p>
          ))}
        </div>

        <ProgressIndicator current={currentChapter + 1} total={chapters.length} />

        <div className="flex gap-3 md:gap-4 justify-center items-center mt-6 md:mt-8 flex-wrap">
          <Button
            onClick={goToPrevChapter}
            disabled={currentChapter === 0}
            variant="outline"
            size="lg"
            className="bg-secondary/50 hover:bg-secondary text-secondary-foreground disabled:opacity-30 rounded-full px-4 md:px-6 text-sm md:text-base"
          >
            ← Previous
          </Button>
          <Button
            onClick={goToNextChapter}
            size="lg"
            className={`bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 md:px-8 text-sm md:text-base ${intensity >= 4 ? 'animate-pulse' : ''}`}
          >
            {currentChapter < chapters.length - 1 ? 'Next →' : 'Ask the Question 💕'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function BackgroundAnimations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating hearts */}
      <div className="floating-element heart-1">💕</div>
      <div className="floating-element heart-2">💖</div>
      <div className="floating-element heart-3">💗</div>
      <div className="floating-element heart-4">💝</div>

      {/* Bunnies */}
      <div className="bunny bunny-1">🐰</div>
      <div className="bunny bunny-2">🐇</div>

      {/* Birds */}
      <div className="bird bird-1">🐦</div>
      <div className="bird bird-2">🕊️</div>

      {/* Butterflies */}
      <div className="butterfly butterfly-1">🦋</div>
      <div className="butterfly butterfly-2">🦋</div>
      <div className="butterfly butterfly-3">🦋</div>

      {/* Clouds */}
      <div className="cloud cloud-1">☁️</div>
      <div className="cloud cloud-2">☁️</div>
      <div className="cloud cloud-3">☁️</div>
    </div>
  )
}

const SPOTIFY_EMBED_ID = 'valentine-spotify-embed'

const SPOTIFY_PLAYLISTS = [
  { name: 'Romantic', uri: 'spotify:playlist:37i9dQZF1DX50QitC6Oqtn', id: '37i9dQZF1DX50QitC6Oqtn' },
  { name: 'Soft Pop', uri: 'spotify:playlist:37i9dQZF1DWTwnEm1IYyoj', id: '37i9dQZF1DWTwnEm1IYyoj' }
] as const

function SpotifyBar() {
  const [currentSong, setCurrentSong] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const controllerRef = useRef<{ togglePlay: () => void; loadUri: (uri: string) => void } | null>(null)
  const initDoneRef = useRef(false)
  const current = SPOTIFY_PLAYLISTS[currentSong]

  useEffect(() => {
    const initSpotify = (IFrameAPI: { createController: (el: HTMLElement, opts: { uri: string; width: number; height: number }, cb: (c: unknown) => void) => void }) => {
      if (initDoneRef.current) return
      const el = document.getElementById(SPOTIFY_EMBED_ID)
      if (!el) return
      initDoneRef.current = true
      IFrameAPI.createController(
        el,
        { uri: SPOTIFY_PLAYLISTS[0].uri, width: 260, height: 80 },
        (controller: { togglePlay: () => void; loadUri: (uri: string) => void; addListener: (event: string, fn: (e: { data?: { isPaused?: boolean } }) => void) => void }) => {
          controllerRef.current = controller
          setReady(true)
          controller.addListener('playback_update', (e) => {
            if (e?.data?.isPaused !== undefined) setIsPlaying(!e.data.isPaused)
          })
        }
      )
    }
    const win = window as Window & { onSpotifyIframeApiReady?: (api: unknown) => void; Spotify?: { IFrameAPI?: unknown } }
    win.onSpotifyIframeApiReady = initSpotify
    if (win.Spotify?.IFrameAPI) {
      initSpotify(win.Spotify.IFrameAPI)
    }
    return () => {
      controllerRef.current = null
      initDoneRef.current = false
    }
  }, [])

  useEffect(() => {
    if (ready && controllerRef.current) {
      controllerRef.current.loadUri(current.uri)
    }
  }, [currentSong, current.uri, ready])

  const handlePlayPause = () => {
    if (controllerRef.current) {
      controllerRef.current.togglePlay()
      setIsPlaying((p) => !p)
    }
  }

  const handlePlaylistChange = (index: number) => {
    setCurrentSong(index)
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-center px-2 py-1.5">
      {/* Short strip so playback works without spoiling the UI */}
      <div
        className="fixed bottom-3 right-3 z-40 w-[260px] max-w-[calc(100vw-2rem)] h-20 rounded-full overflow-hidden border border-primary/20 shadow-md bg-primary/10 backdrop-blur-sm"
        title="Spotify"
      >
        <div id={SPOTIFY_EMBED_ID} className="w-full h-full" />
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-primary/15 backdrop-blur-md border border-primary/25 shadow-md px-4 py-2 w-fit max-w-full">
        <div className="flex gap-1.5 shrink-0">
          {SPOTIFY_PLAYLISTS.map((song, index) => (
            <button
              key={song.uri}
              onClick={() => handlePlaylistChange(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${currentSong === index
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
            >
              {song.name}
            </button>
          ))}
        </div>
        <span className="text-sm text-foreground/90 truncate max-w-[120px] md:max-w-[180px]" title={current.name}>
          {current.name} ♫
        </span>
        <button
          type="button"
          onClick={handlePlayPause}
          disabled={!ready}
          className="shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-sm"
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
      </div>
    </div>
  )
}

function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div
      className="flex gap-2 md:gap-3 justify-center items-center my-4"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Chapter ${current} of ${total}`}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={`text-2xl md:text-3xl transition-all duration-300 ${index < current ? 'opacity-100 scale-110' : 'opacity-30 scale-90'}`}
          aria-hidden
        >
          💖
        </span>
      ))}
    </div>
  )
}
