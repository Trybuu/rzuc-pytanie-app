import { io } from 'socket.io-client'

import { API_PORT, API_URL } from '@/api/apiData'

const socket = io(`http://${API_URL}:${API_PORT}`, {
  transports: ['websocket'],
})

export default socket
