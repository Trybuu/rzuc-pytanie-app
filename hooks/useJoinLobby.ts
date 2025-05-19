import { emitJoinLobby } from '@/client/events'
import { useLobbyStore } from '@/store/lobbyStore'
import { useRouter } from 'expo-router'

const useJoinLobby = () => {
  const setLobby = useLobbyStore((s) => s.setLobby)
  const router = useRouter()

  const join = async (
    accessCode: string,
    playerName: string,
    avatar: string,
  ) => {
    try {
      const lobby = await emitJoinLobby(accessCode, playerName, avatar)

      if (!lobby) {
        return { success: false, message: 'Brak odpowiedzi od serwera' }
      }

      setLobby(lobby)
      router.push({
        pathname: '/lobby',
      })
    } catch (err) {
      return {
        success: false,
        error: err,
        message: 'Nie udało się dołączyć do lobby',
      }
    }
  }

  return { join }
}

export { useJoinLobby }
