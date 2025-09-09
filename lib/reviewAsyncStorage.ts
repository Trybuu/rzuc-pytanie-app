import AsyncStorage from '@react-native-async-storage/async-storage'

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
