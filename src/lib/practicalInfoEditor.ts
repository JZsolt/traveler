import type { PracticalInfoSection } from '@/types/trip'
import type { PracticalInfoEditableSection } from '@/types/components'

let nextPracticalInfoId = 1

export function withPracticalInfoEditorId(section: PracticalInfoEditableSection): PracticalInfoEditableSection {
  return section._eid ? section : { ...section, _eid: nextPracticalInfoId++ }
}

export function stripPracticalInfoEditorIds(sections: PracticalInfoEditableSection[]): PracticalInfoSection[] {
  return sections.map(section => {
    const clean = { ...section }
    delete clean._eid
    return clean
  })
}
