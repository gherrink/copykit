import { initAccordions, createAccordion } from '@/accordion/scripts/services/accordion'
import { initExpand } from '@/_base/scripts/services/expand.ts'

// Initialize all accordions on the page
initExpand()
initAccordions()

// Create a controlled accordion instance for the demo
const controlAccordion = createAccordion('#controlled-accordion', {
  multiSelect: true,
  keyboard: true,
  onOpen: (element: HTMLElement) => {
    // eslint-disable-next-line no-console
    console.log('Accordion opened:', element.textContent?.trim())
  },
  onClose: (element: HTMLElement) => {
    // eslint-disable-next-line no-console
    console.log('Accordion closed:', element.textContent?.trim())
  },
})

// Make it available globally for the demo buttons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).controlAccordion = controlAccordion
