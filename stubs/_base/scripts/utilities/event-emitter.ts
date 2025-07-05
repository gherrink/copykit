/**
 * Generic EventEmitter implementation with type safety
 * @template T - Interface defining event names and their listener function signatures
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventEmitter<T extends Record<keyof T, (...args: any[]) => void>> {
  private events: Map<keyof T, T[keyof T][]> = new Map()

  /**
   * Add an event listener for the specified event
   * @param event - Event name (type-safe)
   * @param listener - Event listener function (type-safe)
   */
  on<K extends keyof T>(event: K, listener: T[K]): void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)!.push(listener)
  }

  /**
   * Remove an event listener for the specified event
   * @param event - Event name (type-safe)
   * @param listener - Event listener function to remove (type-safe)
   */
  off<K extends keyof T>(event: K, listener: T[K]): void {
    if (!this.events.has(event)) return
    const listeners = this.events.get(event)!
    const index = listeners.indexOf(listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  /**
   * Emit an event with the specified parameters
   * @param event - Event name (type-safe)
   * @param args - Arguments to pass to listeners (type-safe)
   */
  emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    if (!this.events.has(event)) return
    // Create a copy of the listeners array to avoid issues when listeners modify the array during iteration
    const listeners = [...this.events.get(event)!]
    listeners.forEach(listener => {
      listener(...args)
    })
  }

  /**
   * Add a one-time event listener for the specified event
   * @param event - Event name (type-safe)
   * @param listener - Event listener function (type-safe)
   */
  once<K extends keyof T>(event: K, listener: T[K]): void {
    const onceListener = (...args: Parameters<T[K]>) => {
      this.off(event, onceListener as T[K])
      listener(...args)
    }
    this.on(event, onceListener as T[K])
  }
}
