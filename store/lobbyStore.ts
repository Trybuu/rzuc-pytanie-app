import { socketEditLobby } from '@/client/events'
import { create } from 'zustand'

export type Question = {
  id: string
  question: string
  isCustomQuestion: boolean
  answers: string[]
  points: number
  category_id: number
}

export type Player = {
  id: string
  playerName: string
  avatar: string
  questionsTargetPlayerId?: string
  isReady: boolean
  questions: Question[]
  points: number
}

export type Category = {
  id: number
  name: string
  is_custom: boolean
  created_at: string
}

export type GameStatus =
  | 'startingGame'
  | 'playerTurn'
  | 'rollingDicePhase'
  | 'rollTheDice'
  | 'questionPhase'
  | 'nextPlayerTurn'
  | 'showAnswerPhase'
  | 'gameOver'
  | 'showQuestion'

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
  lastDiceRoll: number | 0
  drawnQuestion: Question | null
  questionAnswer: string | null
  markedAnswer: string
  gameStarted: boolean
}

type LobbyState = {
  hostId: string
  players: Player[]
  accessCode: string
  rounds: number
  categories: number[]
  currentRound: number
  roundsTotal?: number
  playerTurnIndex: number
  currentCategoryIndex: number
  hasCustomCategory?: boolean
  allCategories?: Category[]
  gameStatus: GameStatus
  lastDiceRoll: number | 0
  drawnQuestion: Question | null
  questionAnswer: string | null
  markedAnswer: string
  gameStarted: boolean
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
  setMarkedAnswer: (markedAnswer: string) => void
  setPlayerPoints: (playerId: string, points: number) => void
  setHostId: (hostId: string) => void
}

export const useLobbyStore = create<LobbyState>((set) => ({
  hostId: '',
  players: [],
  accessCode: '',
  rounds: 1,
  currentRound: 1,
  categories: [],
  playerTurnIndex: 0,
  currentCategoryIndex: 0,
  gameStatus: 'startingGame',
  drawnQuestion: null,
  questionAnswer: null,
  markedAnswer: '',
  gameStarted: false,
  lastDiceRoll: 0,
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
  setMarkedAnswer: (markedAnswer: string) =>
    set((state) => ({ markedAnswer: markedAnswer })),
  setPlayerPoints: (playerId: string, points: number) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, points } : p,
      ),
    })),
  setHostId: (hostId: string) => set((state) => ({ hostId: hostId })),
}))
