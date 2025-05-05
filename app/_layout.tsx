import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="menu"
        options={{ headerShown: true, title: 'Menu' }}
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
    </Stack>
  )
}
