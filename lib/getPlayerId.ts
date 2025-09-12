import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto'

export async function getPlayerId(): Promise<string | null> {
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
}
