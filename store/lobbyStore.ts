import { socketEditLobby } from '@/client/events'
import { create } from 'zustand'

export type Player = {
  id: string
  playerName: string
  avatar: string
}

export type Lobby = {
  hostId: string
  players: Player[]
  accessCode: string
  rounds: number
  categories: number[]
}

type LobbyState = {
  hostId: string
  players: Player[]
  accessCode: string
  rounds: number
  categories: number[]
  setLobby: (lobby: Lobby) => void
  setPlayers: (players: Player[]) => void
  addPlayer: (player: Player) => void
  removePlayer: (id: string) => void
  setRounds: (newRoundsNumber: number) => void
  toggleCategory: (accessCode: string, id: number) => void
  setCategoryList: (categories: number[]) => void
}

export const useLobbyStore = create<LobbyState>((set) => ({
  hostId: '',
  players: [],
  accessCode: '',
  rounds: 1,
  categories: [],
  setLobby: (lobby) => set(() => ({ ...lobby })),
  setPlayers: (players) => set({ players }),
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
}))
