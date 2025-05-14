import { Lobby } from '@/store/lobbyStore'
import socket from './socket'

const socketCreateLobby = async (
  playerName: string,
  avatar: string,
): Promise<Lobby> => {
  return new Promise((resolve, reject) => {
    socket.emit(
      'createLobby',
      {
        playerName: playerName,
        avatar: avatar,
      },
      (response: { success: boolean; lobby: Lobby }) => {
        if (response.success) {
          resolve(response.lobby)
        } else {
          reject(new Error('Nie udało się utworzyć lobby'))
        }
      },
    )
  })
}

// const socketJoinLobby = async (
//   lobbyCode: string,
//   playerName: string,
//   avatar: string,
// ) => {
//   return new Promise((resolve) => {
//     socket.emit(
//       'joinLobby',
//       { lobbyCode, playerName, avatar },
//       (response: {
//         success: boolean
//         message?: string
//         player: { id: string; playerName: string; avatar: string }
//       }) => {
//         if (response.success) {
//           console.log(response.player)
//           resolve(response.player)
//         } else {
//           console.log('Błąd: ', response.message)
//           resolve(`Błąd: ${response.message}`)
//         }
//       },
//     )
//   })
// }

export { socketCreateLobby }
