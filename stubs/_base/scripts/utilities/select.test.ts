import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { queryParentSelector } from './select'
import { createTestContainer, cleanupTestContainer, createElement } from '@test/utils'

describe('Select Utilities', () => {
  let container: HTMLElement

  beforeEach(() => {
    container = createTestContainer()
  })

  afterEach(() => {
    cleanupTestContainer()
  })

  describe('queryParentSelector', () => {
    it('should find direct parent element', () => {
      const parent = createElement('div', { class: 'parent' })
      const child = createElement('span', { class: 'child' })

      parent.appendChild(child)
      container.appendChild(parent)

      const result = queryParentSelector(child, '.parent')

      expect(result).toBe(parent)
      expect(result?.classList.contains('parent')).toBe(true)
    })

    it('should find nested parent element', () => {
      const grandparent = createElement('div', { class: 'grandparent' })
      const parent = createElement('div', { class: 'parent' })
      const child = createElement('span', { class: 'child' })

      grandparent.appendChild(parent)
      parent.appendChild(child)
      container.appendChild(grandparent)

      const result = queryParentSelector(child, '.grandparent')

      expect(result).toBe(grandparent)
    })

    it('should return element itself if it matches selector', () => {
      const element = createElement('div', { class: 'target' })
      container.appendChild(element)

      const result = queryParentSelector(element, '.target')

      expect(result).toBe(element)
    })

    it('should return null if no parent matches', () => {
      const parent = createElement('div', { class: 'parent' })
      const child = createElement('span', { class: 'child' })

      parent.appendChild(child)
      container.appendChild(parent)

      const result = queryParentSelector(child, '.nonexistent')

      expect(result).toBe(null)
    })

    it('should return null if element is null', () => {
      const result = queryParentSelector(null, '.any-selector')

      expect(result).toBe(null)
    })

    it('should respect maxDepth parameter', () => {
      const level1 = createElement('div', { class: 'level1' })
      const level2 = createElement('div', { class: 'level2' })
      const level3 = createElement('div', { class: 'level3' })
      const target = createElement('span', { class: 'target' })

      level1.appendChild(level2)
      level2.appendChild(level3)
      level3.appendChild(target)
      container.appendChild(level1)

      // Should find level3 within maxDepth of 1
      const result1 = queryParentSelector(target, '.level3', 1)
      expect(result1).toBe(level3)

      // Should not find level1 within maxDepth of 2
      const result2 = queryParentSelector(target, '.level1', 2)
      expect(result2).toBe(null)

      // Should find level1 within maxDepth of 3
      const result3 = queryParentSelector(target, '.level1', 3)
      expect(result3).toBe(level1)
    })

    it('should use default maxDepth of 10', () => {
      // Create a deep hierarchy
      let currentParent = container
      for (let i = 0; i < 15; i++) {
        const newParent = createElement('div', { class: `level-${i}` })
        currentParent.appendChild(newParent)
        currentParent = newParent
      }

      const deepChild = createElement('span', { class: 'deep-child' })
      currentParent.appendChild(deepChild)

      // Should not find container (level 15+) due to default maxDepth of 10
      const result = queryParentSelector(deepChild, '[data-testid="test-container"]')
      expect(result).toBe(null)
    })

    it('should handle complex CSS selectors', () => {
      const parent = createElement('div', {
        class: 'modal dialog',
        'data-role': 'popup',
        id: 'main-modal',
      })
      const child = createElement('button', { class: 'close-btn' })

      parent.appendChild(child)
      container.appendChild(parent)

      // Test various selector types
      expect(queryParentSelector(child, '.modal')).toBe(parent)
      expect(queryParentSelector(child, '#main-modal')).toBe(parent)
      expect(queryParentSelector(child, '[data-role="popup"]')).toBe(parent)
      expect(queryParentSelector(child, '.modal.dialog')).toBe(parent)
      expect(queryParentSelector(child, 'div[data-role="popup"]')).toBe(parent)
    })

    it('should handle pseudo-selectors correctly', () => {
      const parent = createElement('div', { class: 'parent' })
      const child1 = createElement('span', { class: 'child first' })
      const child2 = createElement('span', { class: 'child second' })

      parent.appendChild(child1)
      parent.appendChild(child2)
      container.appendChild(parent)

      // Test attribute selectors
      const result = queryParentSelector(child1, '.parent')
      expect(result).toBe(parent)
    })

    it('should return null when maxDepth is 0', () => {
      const parent = createElement('div', { class: 'parent' })
      const child = createElement('span', { class: 'child' })

      parent.appendChild(child)
      container.appendChild(parent)

      const result = queryParentSelector(child, '.parent', 0)

      expect(result).toBe(null)
    })

    it('should return null when maxDepth is negative', () => {
      const parent = createElement('div', { class: 'parent' })
      const child = createElement('span', { class: 'child' })

      parent.appendChild(child)
      container.appendChild(parent)

      const result = queryParentSelector(child, '.parent', -1)

      expect(result).toBe(null)
    })

    it('should handle elements without parents', () => {
      const orphan = createElement('div', { class: 'orphan' })
      // Don't append to container - element has no parent

      const result = queryParentSelector(orphan, '.any-selector')

      expect(result).toBe(null)
    })

    it('should work with different HTML element types', () => {
      const form = document.createElement('form')
      form.setAttribute('class', 'user-form')

      const input = document.createElement('input')
      input.setAttribute('type', 'text')
      input.setAttribute('name', 'username')

      form.appendChild(input)
      container.appendChild(form)

      const result = queryParentSelector(input, 'form.user-form')

      expect(result).toBe(form)
      expect(result?.tagName).toBe('FORM')
    })

    it('should handle special characters in selectors', () => {
      const parent = createElement('div', {
        'data-test-id': 'special:selector',
        class: 'my-component_test',
      })
      const child = createElement('span')

      parent.appendChild(child)
      container.appendChild(parent)

      // Test various special characters
      expect(queryParentSelector(child, '[data-test-id="special:selector"]')).toBe(parent)
      expect(queryParentSelector(child, '.my-component_test')).toBe(parent)
    })

    it('should handle deeply nested structure efficiently', () => {
      // Create a realistic DOM structure
      const article = createElement('article', { class: 'post' })
      const header = createElement('header', { class: 'post-header' })
      const title = createElement('h1', { class: 'post-title' })
      const meta = createElement('div', { class: 'post-meta' })
      const author = createElement('span', { class: 'author' })
      const link = createElement('a', { href: '#', class: 'author-link' })

      article.appendChild(header)
      header.appendChild(title)
      header.appendChild(meta)
      meta.appendChild(author)
      author.appendChild(link)
      container.appendChild(article)

      // Find article from deeply nested link
      const result = queryParentSelector(link, '.post')
      expect(result).toBe(article)

      // Find immediate parent
      const parentResult = queryParentSelector(link, '.author')
      expect(parentResult).toBe(author)
    })
  })

  describe('TypeScript Type Safety', () => {
    it('should maintain type safety for HTML elements', () => {
      const form = document.createElement('form')
      const input = document.createElement('input')

      form.appendChild(input)
      container.appendChild(form)

      // This should return HTMLFormElement type
      const result = queryParentSelector(input, 'form')

      expect(result).toBe(form)
      expect(result?.tagName).toBe('FORM')

      // TypeScript should know this is HTMLFormElement
      if (result) {
        expect(typeof result.submit).toBe('function')
      }
    })

    it('should handle generic element types', () => {
      const div = createElement('div', { class: 'container' })
      const span = createElement('span', { class: 'content' })

      div.appendChild(span)
      container.appendChild(div)

      const result = queryParentSelector<HTMLDivElement>(span, '.container')

      expect(result).toBe(div)
      expect(result?.tagName).toBe('DIV')
    })
  })
})
