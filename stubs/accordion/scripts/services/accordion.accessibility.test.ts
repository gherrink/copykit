import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Accordion } from './accordion'
import {
  createTestContainer,
  cleanupTestContainer,
  expectAccessible,
  createAccordionElement,
  getAccordionControls,
  getAccordionContents,
  navigateAccordion,
  expectFocusedElement,
  expectExpanded,
  expectCollapsed,
  user,
} from '@test/utils'

describe('Accordion Accessibility', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = createTestContainer()
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  describe('ARIA Attributes', () => {
    it('should have proper ARIA attributes on controls', () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)

      controls.forEach((control, index) => {
        expect(control).toHaveAttribute('aria-expanded', 'false')
        expect(control).toHaveAttribute('aria-controls', `content-${index}`)
        expect(control.tagName).toBe('BUTTON') // Button elements have implicit role
      })
    })

    it('should update aria-expanded when items are toggled', async () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)

      // Initially collapsed
      expectCollapsed(controls[0])

      // Open first item
      await user.click(controls[0])
      expectExpanded(controls[0])

      // Close first item
      await user.click(controls[0])
      expectCollapsed(controls[0])
    })

    it('should have proper id and aria-controls relationship', () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)
      const contents = getAccordionContents(accordion)

      controls.forEach((control, index) => {
        const controlledId = control.getAttribute('aria-controls')
        const contentId = contents[index].getAttribute('id')

        expect(controlledId).toBe(contentId)
        expect(controlledId).toBe(`content-${index}`)
      })
    })

    it('should handle content visibility with hidden attribute', async () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)
      const contents = getAccordionContents(accordion)

      // Initially hidden
      contents.forEach(content => {
        expect(content).toHaveAttribute('hidden')
      })

      // Open first item
      await user.click(controls[0])

      expect(contents[0]).not.toHaveAttribute('hidden')
      expect(contents[1]).toHaveAttribute('hidden')
      expect(contents[2]).toHaveAttribute('hidden')
    })
  })

  describe('Keyboard Navigation Accessibility', () => {
    it('should support arrow key navigation', async () => {
      const accordion = createAccordionElement({ itemCount: 3, keyboard: true })
      container.appendChild(accordion)

      new Accordion(accordion, { keyboard: true })

      const controls = getAccordionControls(accordion)

      // Start at first control
      controls[0].focus()
      expectFocusedElement(controls[0])

      // Navigate with arrow keys
      await navigateAccordion(controls[0], 'ArrowDown')
      expectFocusedElement(controls[1])

      await navigateAccordion(controls[1], 'ArrowDown')
      expectFocusedElement(controls[2])

      // Wrap around to first
      await navigateAccordion(controls[2], 'ArrowDown')
      expectFocusedElement(controls[0])

      // Navigate backwards
      await navigateAccordion(controls[0], 'ArrowUp')
      expectFocusedElement(controls[2])
    })

    it('should support Home and End keys', async () => {
      const accordion = createAccordionElement({ itemCount: 5, keyboard: true })
      container.appendChild(accordion)

      new Accordion(accordion, { keyboard: true })

      const controls = getAccordionControls(accordion)

      // Start at middle control
      controls[2].focus()
      expectFocusedElement(controls[2])

      // Home should go to first
      await navigateAccordion(controls[2], 'Home')
      expectFocusedElement(controls[0])

      // End should go to last
      await navigateAccordion(controls[0], 'End')
      expectFocusedElement(controls[4])
    })

    it('should support Space and Enter for activation', async () => {
      const accordion = createAccordionElement({ itemCount: 3, keyboard: true })
      container.appendChild(accordion)

      new Accordion(accordion, { keyboard: true })

      const controls = getAccordionControls(accordion)

      controls[0].focus()

      // Space should toggle
      await user.keyboard(' ')
      expectExpanded(controls[0])

      await user.keyboard(' ')
      expectCollapsed(controls[0])

      // Enter should also toggle
      await user.keyboard('{Enter}')
      expectExpanded(controls[0])
    })

    it('should maintain focus management in single-select mode', async () => {
      const accordion = createAccordionElement({ itemCount: 3, keyboard: true })
      container.appendChild(accordion)

      new Accordion(accordion, { multiSelect: false, keyboard: true })

      const controls = getAccordionControls(accordion)

      // Open first item via keyboard
      controls[0].focus()
      await user.keyboard(' ')
      expectExpanded(controls[0])
      expectFocusedElement(controls[0])

      // Navigate to second item and open it
      await user.keyboard('{ArrowDown}')
      expectFocusedElement(controls[1])

      await user.keyboard(' ')
      expectExpanded(controls[1])
      expectCollapsed(controls[0]) // First should close
      expectFocusedElement(controls[1])
    })
  })

  describe('Screen Reader Accessibility', () => {
    it('should have proper semantic structure', () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)
      const contents = getAccordionContents(accordion)

      // Controls should be buttons (implicit type="button" for button elements)
      controls.forEach(control => {
        expect(control.tagName).toBe('BUTTON')
      })

      // Contents should have meaningful content
      contents.forEach((content, index) => {
        expect(content.textContent).toContain(`Content for item ${index + 1}`)
      })
    })

    it('should provide clear state information', async () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)

      // Test expanded/collapsed states are clear
      expect(controls[0]).toHaveAttribute('aria-expanded', 'false')

      await user.click(controls[0])
      expect(controls[0]).toHaveAttribute('aria-expanded', 'true')
    })

    it('should handle focus indicators properly', () => {
      const accordion = createAccordionElement({ itemCount: 3, keyboard: true })
      container.appendChild(accordion)

      new Accordion(accordion, { keyboard: true })

      const controls = getAccordionControls(accordion)

      // All controls should be focusable
      controls.forEach(control => {
        expect(control.tabIndex).toBeGreaterThanOrEqual(0)
      })
    })
  })

  describe('Content Accessibility', () => {
    it('should handle inert attribute when configured with data-inert', async () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      const contents = getAccordionContents(accordion)

      // Add data-inert attribute to contents to enable inert management
      contents.forEach(content => {
        content.setAttribute('data-inert', '.other-content')
      })

      container.appendChild(accordion)

      // Add other content that should be made inert
      const otherContent = document.createElement('div')
      otherContent.className = 'other-content'
      otherContent.innerHTML = '<button>Other button</button>'
      container.appendChild(otherContent)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)

      // Open first item
      await user.click(controls[0])

      // Other content should be made inert when accordion opens
      expect(otherContent).toHaveAttribute('inert')
    })

    it('should properly hide/show content for screen readers', async () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      const contents = getAccordionContents(accordion)

      // Add interactive content
      contents.forEach((content, index) => {
        content.innerHTML = `
          <div>
            <p>Content ${index + 1}</p>
            <input type="text" value="Input ${index + 1}" />
            <button>Button ${index + 1}</button>
          </div>
        `
      })

      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)

      // Initially, all content should be hidden
      contents.forEach(content => {
        expect(content).toHaveAttribute('hidden')
      })

      // Open first item
      await user.click(controls[0])

      // First content should be visible, others hidden
      expect(contents[0]).not.toHaveAttribute('hidden')
      expect(contents[1]).toHaveAttribute('hidden')
      expect(contents[2]).toHaveAttribute('hidden')

      // Verify content is properly accessible when opened
      const firstInput = contents[0].querySelector('input')
      expect(firstInput).toBeInTheDocument()
      expect(firstInput?.closest('[hidden]')).toBeNull()
    })
  })

  describe('Automated Accessibility Testing', () => {
    it('should pass axe-core accessibility scan when closed', async () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      await expectAccessible(accordion)
    })

    it('should pass axe-core accessibility scan when items are open', async () => {
      const accordion = createAccordionElement({ itemCount: 3, multiSelect: true })
      container.appendChild(accordion)

      const accordionInstance = new Accordion(accordion, { multiSelect: true })

      // Open all items
      accordionInstance.openAll()

      await expectAccessible(accordion)
    })

    it('should pass axe-core scan during keyboard navigation', async () => {
      const accordion = createAccordionElement({ itemCount: 3, keyboard: true })
      container.appendChild(accordion)

      new Accordion(accordion, { keyboard: true })

      const controls = getAccordionControls(accordion)

      // Focus and navigate
      controls[0].focus()
      await navigateAccordion(controls[0], 'ArrowDown')

      await expectAccessible(accordion)
    })

    it('should pass axe-core scan in single-select mode', async () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion, { multiSelect: false })

      const controls = getAccordionControls(accordion)

      // Open one item
      await user.click(controls[1])

      await expectAccessible(accordion)
    })

    it('should pass axe-core scan with complex content', async () => {
      const accordion = createAccordionElement({ itemCount: 2 })
      const contents = getAccordionContents(accordion)

      // Add complex content with form elements
      contents[0].innerHTML = `
        <div>
          <h3>Form Content</h3>
          <label for="test-input">Test Input:</label>
          <input id="test-input" type="text" name="test" />
          <button type="button">Submit</button>
        </div>
      `

      contents[1].innerHTML = `
        <div>
          <h3>List Content</h3>
          <ul>
            <li><a href="#test">Link 1</a></li>
            <li><a href="#test">Link 2</a></li>
          </ul>
        </div>
      `

      container.appendChild(accordion)

      const accordionInstance = new Accordion(accordion)

      // Open first item
      accordionInstance.open(0)

      await expectAccessible(accordion)
    })
  })

  describe('Color Contrast and Visual Accessibility', () => {
    it('should maintain accessibility during animations', async () => {
      const accordion = createAccordionElement({
        itemCount: 3,
        animate: true,
      })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)

      // Open item with animation
      await user.click(controls[0])

      // Should still be accessible during animation
      await expectAccessible(accordion)
    })

    it('should handle focus indicators properly', () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)

      // Focus should be visible and accessible
      controls[0].focus()

      // Browser should handle focus indicators
      expect(document.activeElement).toBe(controls[0])
    })
  })

  describe('Mobile Accessibility', () => {
    it('should handle touch interactions accessibly', async () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      container.appendChild(accordion)

      new Accordion(accordion)

      const controls = getAccordionControls(accordion)

      // Touch interaction via click should work
      await user.click(controls[0])
      expectExpanded(controls[0])

      await expectAccessible(accordion)
    })

    it('should maintain accessibility with reduced motion', () => {
      // Simulate reduced motion preference
      const accordion = createAccordionElement({
        itemCount: 3,
        animate: false, // No animation for reduced motion
      })
      container.appendChild(accordion)

      new Accordion(accordion)

      // Should still be fully accessible without animations
      expect(accordion.querySelector('.content[data-animate]')).toBeNull()
    })
  })

  describe('Error States and Edge Cases', () => {
    it('should handle missing aria-controls gracefully', () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      const controls = getAccordionControls(accordion)

      // Remove aria-controls from one control
      controls[1].removeAttribute('aria-controls')

      container.appendChild(accordion)

      // Should not crash and should handle the error gracefully
      expect(() => {
        new Accordion(accordion)
      }).not.toThrow()
    })

    it('should handle missing content elements gracefully', () => {
      const accordion = createAccordionElement({ itemCount: 3 })
      const contents = getAccordionContents(accordion)

      // Remove one content element
      contents[1].remove()

      container.appendChild(accordion)

      // Should not crash
      expect(() => {
        new Accordion(accordion)
      }).not.toThrow()
    })

    it('should maintain accessibility with dynamic content changes', async () => {
      const accordion = createAccordionElement({ itemCount: 2 })
      container.appendChild(accordion)

      const accordionInstance = new Accordion(accordion)
      const contents = getAccordionContents(accordion)

      // Open first item
      accordionInstance.open(0)

      // Dynamically change content
      contents[0].innerHTML = '<p>New dynamic content</p>'

      // Should still be accessible
      await expectAccessible(accordion)
    })
  })
})
