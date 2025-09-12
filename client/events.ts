import { Lobby } from '@/store/lobbyStore'
import socket from './socket'

const emitCreateLobby = async (
  playerName: string,
  avatar: string,
  playerId: string,
): Promise<Lobby> => {
  return new Promise((resolve, reject) => {
    socket.emit(
      'createLobby',
      {
        playerName: playerName,
        avatar: avatar,
        playerId: playerId,
      },
      (response: { success: boolean; message: string; lobby: Lobby }) => {
        if (response.success) {
          resolve(response.lobby)
        } else {
          reject(response.message)
        }
      },
    )
  })
}

const emitJoinLobby = async (
  lobbyCode: string,
  playerName: string,
  avatar: string,
  playerId: string,
): Promise<Lobby> => {
  return new Promise((resolve, reject) => {
    socket.emit(
      'joinLobby',
      { lobbyCode, playerName, avatar, playerId },
      (response: { success: boolean; message?: string; lobby: Lobby }) => {
        if (response.success) {
          resolve(response.lobby)
        } else {
          reject(response.message)
        }
      },
    )
  })
}

const socketEditLobby = (
  accessCode: string,
  action: 'changeRoundsNumber' | 'changeCategories',
  newValue: any,
) => {
  socket.emit(
    'lobbyEdit',
    {
      lobbyCode: accessCode,
      action: action,
      newValue: newValue,
    },
    (response: { success: boolean; message?: string; lobby?: Lobby }) => {
      if (!response.success) {
        console.error(`Błąd: ${response.message}`)
      }
    },
  )
}

export { emitCreateLobby, emitJoinLobby, socketEditLobby }
