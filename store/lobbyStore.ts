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
}

type LobbyState = {
  hostId: string
  players: Player[]
  accessCode: string
  createLobby: (lobby: Lobby) => void
  setPlayers: (players: Player[]) => void
  addPlayer: (player: Player) => void
  removePlayer: (id: string) => void
}

export const useLobbyStore = create<LobbyState>((set) => ({
  hostId: '',
  players: [],
  accessCode: '',
  createLobby: (newLobby) =>
    set(() => ({
      hostId: newLobby.hostId,
      players: newLobby.players,
      accessCode: newLobby.accessCode,
    })),
  setPlayers: (players) => set({ players }),
  addPlayer: (player) =>
    set((state) => ({ players: [...state.players, player] })),
  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    })),
}))
