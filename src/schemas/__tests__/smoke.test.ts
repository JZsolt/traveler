import { describe, it, expect } from 'vitest'
import { TripSchema } from '../trip'

describe('test setup smoke', () => {
  it('imports a schema without error', () => {
    expect(TripSchema).toBeDefined()
  })
})
