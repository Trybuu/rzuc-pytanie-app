import socket from './socket'

const socketCreateLobby = async (
  playerName: string,
  playerImg: string,
): Promise<string | null> => {
  return new Promise((resolve) => {
    socket.emit(
      'createLobby',
      {
        playerName: playerName,
        avatar: playerImg,
      },
      (response: { success: boolean; lobbyCode?: string }) => {
        if (response.success && response.lobbyCode) {
          resolve(response.lobbyCode)
        } else {
          resolve(null)
        }
      },
    )
  })
}

export { socketCreateLobby }
