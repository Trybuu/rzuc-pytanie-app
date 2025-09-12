import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto'
import { Platform } from 'react-native'

export async function getPlayerId(): Promise<string | null | undefined> {
  if (Platform.OS === 'ios') {
    try {
      const playerId = await AsyncStorage.getItem('playerId')

      if (playerId) {
        return playerId
      } else {
        const newPlayerId = Crypto.randomUUID()
        await AsyncStorage.setItem('playerId', newPlayerId)
        return newPlayerId
      }
    } catch (error) {
      console.error('Error getting or setting playerId:', error)
      return null
    }
  } else if (Platform.OS === 'web') {
    try {
      let playerId = localStorage.getItem('playerId')

      if (playerId) {
        return playerId
      } else {
        const newPlayerId = crypto.randomUUID()
        localStorage.setItem('playerId', newPlayerId)
        return newPlayerId
      }
    } catch (error) {
      console.error('Error getting or setting playerId:', error)
      return null
    }
  }
}
