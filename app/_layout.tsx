import BackgroundWrapper from '@/components/BackgroundWrapper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

const queryClient = new QueryClient()

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    MuseoModerno: require('../assets/fonts/MuseoModerno-Regular.ttf'),
  })

  const defaultScreenOptions = {
    headerShown: false,
    gestureEnabled: false,
  }

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BackgroundWrapper>
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
              gestureEnabled: false,
              animation: 'none',
              headerBackTitleStyle: {
                fontFamily: 'MuseoModerno',
                fontSize: 16,
              },
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Stack.Screen
              name="index"
              options={{
                ...defaultScreenOptions,
                title: 'Start',
              }}
            />
            <Stack.Screen
              name="menu"
              options={{
                ...defaultScreenOptions,
                title: 'Menu',
              }}
            />
            <Stack.Screen
              name="newGame"
              options={{ ...defaultScreenOptions, title: 'Rozpocznij grę' }}
            />
            <Stack.Screen
              name="joinGame"
              options={{ ...defaultScreenOptions, title: 'Dołącz do gry' }}
            />
            <Stack.Screen
              name="howToPlay"
              options={{ ...defaultScreenOptions, title: 'Jak grać' }}
            />
            <Stack.Screen
              name="questionCategories"
              options={{ ...defaultScreenOptions, title: 'Kategorie pytań' }}
            />
            <Stack.Screen
              name="lobby"
              options={{
                ...defaultScreenOptions,
                title: 'Gra utworzona',
              }}
            />
            <Stack.Screen
              name="game"
              options={{
                ...defaultScreenOptions,
                title: 'Gra',
              }}
            />
          </Stack>
        </QueryClientProvider>
      </BackgroundWrapper>
    </GestureHandlerRootView>
  )
}
