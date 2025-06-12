import { socketEditLobby } from '@/client/events'
import { create } from 'zustand'

export type Question = {
  id: string
  question: string
  isCustomQuestion: boolean
  answers: string[]
  points: number
}

export type Player = {
  id: string
  playerName: string
  avatar: string
  questionsTargetPlayerId?: string
  isReady: boolean
  questions: Question[]
}

export type Category = {
  id: number
  name: string
  is_custom: boolean
  created_at: string
}

export type GameStatus =
  | 'lobbyWaiting' // Przed rozpoczęciem gry, przygotowywanie pytań itp.
  | 'roundStarting' // Rozpoczęcie nowej rundy, informacja o tym, czyja jest kolej
  | 'diceRoll' // Faza rzutu kostką
  | 'questionDisplay' // Wyświetlanie pytania
  | 'answerPhase' // Czas na odpowiedź na pytanie
  | 'answerEvaluation' // Ocena odpowiedzi (np. przez hosta lub automatycznie)
  | 'roundEnd' // Koniec rundy, podsumowanie, przejście do kolejnego gracza/rundy
  | 'gameOver' // Gra zakończona

export type Lobby = {
  hostId: string
  players: Player[]
  accessCode: string
  rounds: number
  categories: number[]
  currentRound?: number
  roundsTotal?: number
  playerTurnIndex: number
  currentCategoryIndex: number
  hasCustomCategory?: boolean
  allCategories?: Category[]
  gameStatus: GameStatus
}

type LobbyState = {
  hostId: string
  players: Player[]
  accessCode: string
  rounds: number
  categories: number[]
  currentRound?: number
  roundsTotal?: number
  playerTurnIndex: number
  currentCategoryIndex: number
  hasCustomCategory?: boolean
  allCategories?: Category[]
  gameStatus: GameStatus
  setLobby: (lobby: Lobby) => void
  resetLobby: () => void
  setPlayers: (players: Player[]) => void
  setPlayer: (id: string, player: Player) => void
  addPlayer: (player: Player) => void
  removePlayer: (id: string) => void
  setRounds: (newRoundsNumber: number) => void
  toggleCategory: (accessCode: string, id: number) => void
  setCategoryList: (categories: number[]) => void
  setGameStatus: (status: GameStatus) => void
}

export const useLobbyStore = create<LobbyState>((set) => ({
  hostId: '',
  players: [],
  accessCode: '',
  rounds: 1,
  categories: [],
  playerTurnIndex: 0,
  currentCategoryIndex: 0,
  gameStatus: 'changingPlayer',
  setLobby: (lobby) => set(() => ({ ...lobby })),
  resetLobby: () =>
    set(() => ({
      hostId: '',
      players: [],
      accessCode: '',
      rounds: 1,
      categories: [],
    })),
  setPlayers: (players) => set({ players }),
  setPlayer: (id, player) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === id ? player : p)),
    })),
  addPlayer: (player) =>
    set((state) => ({ players: [...state.players, player] })),
  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    })),
  setRounds: (newRoundsNumber) => set((state) => ({ rounds: newRoundsNumber })),
  toggleCategory: (accessCode, id) =>
    set((state) => {
      const newCategories = state.categories.includes(id)
        ? state.categories.filter((c) => c !== id)
        : [...state.categories, id]
      // Wyślij na serwer
      socketEditLobby(accessCode, 'changeCategories', newCategories)
      return { categories: newCategories }
    }),
  setCategoryList: (categories) => set({ categories }),
  setGameStatus: (gameStatus: GameStatus) =>
    set((state) => ({ gameStatus: gameStatus })),
}))
