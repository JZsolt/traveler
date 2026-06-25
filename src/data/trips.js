const tripModules = import.meta.glob(['./trips/*.json', '!./trips/_template.json'], { eager: true })

export const trips = Object.values(tripModules).map(module => module.default)
