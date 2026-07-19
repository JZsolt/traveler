export const queryKeys = {
  trips: {
    all: ['trips'] as const,
    bySlug: (slug: string) => ['trips', slug] as const,
  },
  profile: {
    current: ['profile'] as const,
  },
} as const
