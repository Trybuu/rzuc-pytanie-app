import { emitCreateLobby } from '@/client/events'
import { useLobbyStore } from '@/store/lobbyStore'
import { useRouter } from 'expo-router'

const useCreateLobby = () => {
  const setLobby = useLobbyStore((s) => s.setLobby)
  const router = useRouter()

  const create = async (name: string, image: string) => {
    try {
      const lobby = await emitCreateLobby(name, image)

      if (!lobby) {
        return { success: false, message: 'Brak odpowiedzi z serwera' }
      }

      setLobby(lobby)
      router.push({
        pathname: '/lobby',
        params: { accessCode: lobby.accessCode },
      })

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err,
        message: 'Nie udało się utworzyć lobby',
      }
    }
  }

  return { create }
}

export { useCreateLobby }
