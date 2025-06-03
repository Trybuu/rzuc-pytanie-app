import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    MuseoModerno: require('../assets/fonts/MuseoModerno-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerLargeTitleShadowVisible: false,
          headerTintColor: '#fff',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: 'MuseoModerno',
            fontSize: 16,
          },
          headerStyle: {
            backgroundColor: '#2B2F41',
          },
          headerBackTitleStyle: {
            fontFamily: 'MuseoModerno',
            fontSize: 16,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false, title: 'Start' }}
        />
        <Stack.Screen
          name="menu"
          options={{
            headerShown: true,
            title: 'Menu',
          }}
        />
        <Stack.Screen
          name="newGame"
          options={{ headerShown: true, title: 'Rozpocznij grę' }}
        />
        <Stack.Screen
          name="joinGame"
          options={{ headerShown: true, title: 'Dołącz do gry' }}
        />
        <Stack.Screen
          name="howToPlay"
          options={{ headerShown: true, title: 'Jak grać' }}
        />
        <Stack.Screen
          name="questionCategories"
          options={{ headerShown: true, title: 'Kategorie pytań' }}
        />
        <Stack.Screen
          name="lobby"
          options={{
            headerShown: false,
            title: 'Gra utworzona',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="game"
          options={{
            headerShown: false,
            title: 'Gra',
            gestureEnabled: false,
          }}
        />
      </Stack>
    </QueryClientProvider>
  )
}
