export const DEFAULT_PERSON_COUNT = 4

export function getPersonCount(people: string | undefined | null): number {
  const match = String(people || '').match(/\d+/)
  return match ? Number(match[0]) : DEFAULT_PERSON_COUNT
}
