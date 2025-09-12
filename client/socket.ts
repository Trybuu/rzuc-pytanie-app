import { io } from 'socket.io-client'

// const apiUrl = APP_MODE === 'prod' ? process.env.API_URL : API_URL

const socket = io(process.env.API_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 10000,
  reconnectionAttempts: Infinity,
})

export default socket
