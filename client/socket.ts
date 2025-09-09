import { APP_MODE } from '@/api/apiData'
import { io } from 'socket.io-client'

const apiUrl =
  APP_MODE === 'dev' ? process.env.EXPO_PUBLIC_API_URL : process.env.API_URL

const socket = io(apiUrl, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: Infinity,
})

export default socket
