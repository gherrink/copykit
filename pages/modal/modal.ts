import { initModals } from '@/modal/scripts/services/modal'

// Initialize modal functionality
initModals()

// Modal open/close functions for the demo page
declare global {
  interface Window {
    openBasicModal: () => void
    closeBasicModal: () => void
    openSmallModal: () => void
    closeSmallModal: () => void
    openLargeModal: () => void
    closeLargeModal: () => void
    openFullscreenModal: () => void
    closeFullscreenModal: () => void
    openSimpleModal: () => void
    closeSimpleModal: () => void
    openBackdropTestModal: () => void
    closeBackdropTestModal: () => void
    testAutoOpenModal: () => void
    closeAutoOpenTestModal: () => void
    testDelayedModal: () => void
    closeDelayedTestModal: () => void
  }
}

// Basic Modal
window.openBasicModal = () => {
  const modal = document.getElementById('basic-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.openModal()
  }
}

window.closeBasicModal = () => {
  const modal = document.getElementById('basic-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.close()
  }
}

// Small Modal
window.openSmallModal = () => {
  const modal = document.getElementById('small-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.openModal()
  }
}

window.closeSmallModal = () => {
  const modal = document.getElementById('small-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.close()
  }
}

// Large Modal
window.openLargeModal = () => {
  const modal = document.getElementById('large-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.openModal()
  }
}

window.closeLargeModal = () => {
  const modal = document.getElementById('large-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.close()
  }
}

// Fullscreen Modal
window.openFullscreenModal = () => {
  const modal = document.getElementById('fullscreen-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.openModal()
  }
}

window.closeFullscreenModal = () => {
  const modal = document.getElementById('fullscreen-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.close()
  }
}

// Simple Modal
window.openSimpleModal = () => {
  const modal = document.getElementById('simple-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.openModal()
  }
}

window.closeSimpleModal = () => {
  const modal = document.getElementById('simple-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.close()
  }
}

// Backdrop Test Modal
window.openBackdropTestModal = () => {
  const modal = document.getElementById('backdrop-test-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.openModal()
  }
}

window.closeBackdropTestModal = () => {
  const modal = document.getElementById('backdrop-test-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.close()
  }
}

// Auto-Open Test Modal
window.testAutoOpenModal = () => {
  const modal = document.getElementById('auto-open-test-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.openModal()
  }
}

window.closeAutoOpenTestModal = () => {
  const modal = document.getElementById('auto-open-test-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.close()
  }
}

// Delayed Auto-Open Test Modal
window.testDelayedModal = () => {
  const modal = document.getElementById('delayed-test-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    // Simply show the modal after 2 seconds to demonstrate delayed opening
    setTimeout(() => {
      if (!modal.open) {
        modal.__modal.openModal()
      }
    }, 2000)
  }
}

window.closeDelayedTestModal = () => {
  const modal = document.getElementById('delayed-test-modal') as HTMLDialogElement
  if (modal && modal.__modal) {
    modal.__modal.close()
  }
}
