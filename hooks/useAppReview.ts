import AsyncStorage from '@react-native-async-storage/async-storage'
import * as StoreReview from 'expo-store-review'
import { useEffect } from 'react'

const LAUNCH_COUNT_KEY = 'launchCount'
const APP_REVIEWED_KEY = 'appReviewed'

export async function setAppReviewed() {
  try {
    await AsyncStorage.setItem(APP_REVIEWED_KEY, 'true')
  } catch (error) {
    console.error('Błąd przy ustawianiu flagi recenzji aplikacji:', error)
  }
}

export async function getAppReviewed() {
  try {
    const value = await AsyncStorage.getItem(APP_REVIEWED_KEY)
    return value === 'true'
  } catch (error) {
    console.error('Błąd przy pobieraniu flagi recenzji aplikacji:', error)
    return false
  }
}

export async function incrementLaunchCount() {
  try {
    const value = await AsyncStorage.getItem(LAUNCH_COUNT_KEY)
    let count = value ? parseInt(value, 10) : 0
    count++
    await AsyncStorage.setItem(LAUNCH_COUNT_KEY, count.toString())
    return count
  } catch (error) {
    console.error('Błąd przy zliczaniu uruchomień:', error)
    return 0
  }
}

export async function resetLaunchCount() {
  await AsyncStorage.removeItem(LAUNCH_COUNT_KEY)
}

export function useAppReview(treshold = 3) {
  useEffect(() => {
    ;(async () => {
      const reviewed = await getAppReviewed()
      if (reviewed) return

      const launchCount = await incrementLaunchCount()

      if (launchCount >= treshold && (await StoreReview.isAvailableAsync())) {
        StoreReview.requestReview()
        await setAppReviewed()
      }
    })()
  }, [treshold])
}
