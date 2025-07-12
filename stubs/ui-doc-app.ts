import { initExpand } from '@/_base/scripts/services/expand.ts'
import { ready } from '@/_base/scripts/utilities/dom.ts'
import { initAccordions } from '@/accordion/scripts/services/accordion.ts'

ready(() => {
  initExpand()
  initAccordions()
})
