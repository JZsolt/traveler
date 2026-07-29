import { createContext } from 'react'

// Read-only mod jelzese a trip komponensfanak. Alapertelmezetten false, igy az
// owner (app) nezet valtozatlanul szerkesztheto marad. A megosztott (public)
// oldal teszi true-ra, amivel a komponensek elrejtik a sajat szerkeszto UI-jukat.
export const ReadOnlyContext = createContext(false)
