import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'

// Mock IntersectionObserver if not available in jsdom
global.IntersectionObserver = class IntersectionObserver implements IntersectionObserver {
  root = null
  rootMargin = ''
  thresholds = []

  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

// Mock ResizeObserver if not available in jsdom
global.ResizeObserver = class ResizeObserver implements ResizeObserver {
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Mock requestAnimationFrame for animations
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 0)
}

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id)
}

// Mock getBoundingClientRect for DOM testing
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
}))

// Mock CSS animations for testing
Element.prototype.animate = vi.fn(() => {
  const mockAnimation = {
    cancel: vi.fn(),
    finish: vi.fn(),
    pause: vi.fn(),
    play: vi.fn(),
    reverse: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    currentTime: 0,
    effect: null,
    finished: Promise.resolve({} as Animation),
    id: '',
    playState: 'finished' as AnimationPlayState,
    playbackRate: 1,
    ready: Promise.resolve({} as Animation),
    startTime: 0,
    timeline: null,
    commitStyles: vi.fn(),
    persist: vi.fn(),
    updatePlaybackRate: vi.fn(),
    replaceState: 'active' as AnimationReplaceState,
    pending: false,
    oncancel: null,
    onfinish: null,
    onremove: null,
  }
  return mockAnimation as Animation
})

// Mock Canvas API for axe-core
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn((contextId: string) => {
    if (contextId === '2d') {
      // Return a mock 2D context that axe-core needs
      return {
        fillStyle: '#000000',
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        getImageData: vi.fn(() => ({
          data: new Uint8ClampedArray(4 * 200 * 200),
          width: 200,
          height: 200,
        })),
        putImageData: vi.fn(),
        createImageData: vi.fn(),
        setTransform: vi.fn(),
        resetTransform: vi.fn(),
        scale: vi.fn(),
        translate: vi.fn(),
        rotate: vi.fn(),
        transform: vi.fn(),
        save: vi.fn(),
        restore: vi.fn(),
        measureText: vi.fn(() => ({ width: 50 })),
        font: '10px Arial',
        textAlign: 'start',
        textBaseline: 'alphabetic',
        canvas: { width: 200, height: 200 },
      } as unknown as CanvasRenderingContext2D
    }
    return null
  }),
  writable: true,
  configurable: true,
})

// Mock additional Canvas methods that axe-core might use
Object.defineProperty(HTMLCanvasElement.prototype, 'toDataURL', {
  value: vi.fn(() => 'data:image/png;base64,'),
  writable: true,
  configurable: true,
})

// Ensure OffscreenCanvas is available (simple mock)
if (typeof global.OffscreenCanvas === 'undefined') {
  global.OffscreenCanvas = class MockOffscreenCanvas {
    width: number
    height: number

    constructor(width: number, height: number) {
      this.width = width
      this.height = height
    }

    getContext() {
      return null
    }

    convertToBlob() {
      return Promise.resolve(new Blob())
    }

    transferToImageBitmap() {
      return {} as ImageBitmap
    }
  } as never
}
