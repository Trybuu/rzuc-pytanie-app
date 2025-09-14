import { io } from 'socket.io-client'

const socket = io(process.env.EXPO_PUBLIC_API_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: Infinity,
})

export default socket
