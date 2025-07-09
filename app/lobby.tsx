import { Category, getCategories } from '@/api/category'
import { socketEditLobby } from '@/client/events'
import socket from '@/client/socket'
import AccessCodeView from '@/components/AccessCodeView'
import MyButton from '@/components/Button'
import ExitGameButton from '@/components/ExitGameButton'
import MyText from '@/components/MyText'
import { Lobby as LobbyType, useLobbyStore } from '@/store/lobbyStore'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

export default function Lobby() {
  const navigation = useNavigation()

  // Wykorzystanie danych z lobbyStore
  const { accessCode, players, hostId, rounds, categories } = useLobbyStore(
    (state) => state,
  )
  const {
    setLobby,
    resetLobby,
    setPlayers,
    toggleCategory,
    setCategoryList,
    setRounds,
  } = useLobbyStore()

  // Czy gracz jest hostem rozgrywki
  const playerSocketId = socket.id
  const isHost = playerSocketId === hostId

  // Zapisywanie danych z API
  const [availableCategories, setAvailableCategories] = useState<
    Category[] | null
  >(null)

  useEffect(() => {
    const listener = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      navigation.dispatch(e.data.action)
    })

    return () => {
      listener()
    }
  })

  // Nasłuchiwanie socketów
  useEffect(() => {
    const handleLobbyCreated = (lobbyData: LobbyType) => {
      setLobby(lobbyData)
    }

    const handleLobbyUpdated = (
      lobbyData: LobbyType & { rounds: number; categories: number[] },
    ) => {
      setPlayers(lobbyData.players)
      setRounds(lobbyData.rounds)
      setCategoryList(lobbyData.categories)
    }

    const handleGameStarted = (lobbyData: LobbyType) => {
      setLobby(lobbyData)

      // Przekierowanie do ekranu gry
      router.replace({
        pathname: '/game',
        params: { accessCode: lobbyData.accessCode },
      })
    }
    socket.on('lobbyCreated', handleLobbyCreated)
    socket.on('lobbyUpdated', handleLobbyUpdated)
    socket.on('gameStarted', handleGameStarted)

    return () => {
      socket.off('lobbyCreated', handleLobbyCreated)
      socket.off('lobbyUpdated', handleLobbyUpdated)
      socket.off('gameStarted', handleGameStarted)
    }
  }, [setPlayers, setRounds, setCategoryList])

  // Zapytania do API
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()

      setAvailableCategories(categories)
      console.log(categories)
    }

    fetchCategories()
  }, [])

  // Aktualizuj wartość ilości rund w rozgrywce
  const handleSetRounds = (action: 'add' | 'subtract') => {
    if (!isHost) return

    let roundsNumber: number = rounds

    if (action === 'add' && roundsNumber < 6) {
      roundsNumber = roundsNumber + 1
    }

    if (action === 'subtract' && roundsNumber > 1) {
      roundsNumber = roundsNumber - 1
    }

    socketEditLobby(accessCode, 'changeRoundsNumber', roundsNumber)
  }

  // Aktualizuj wybrane kategorie pytań
  const handleSelectCategory = (id: number) => {
    if (!isHost) return
    toggleCategory(accessCode, id)
  }

  // Opuść grę
  const handleExitGame = () => {
    console.log('Socket Disconnect')
    socket.disconnect()
    resetLobby()
    router.replace({
      pathname: '/joinGame',
    })
    socket.connect()
  }

  // Rozpocznij grę
  const handleStartGame = () => {
    if (!isHost) return
    // Sprawdź, czy wybrano kategorie pytań i czy jest więcej niż 1 gracz!!!
    if (categories.length < 1) {
      Alert.alert('Wybierz przynajmniej jedną kategorię pytań')
      return
    } else if (players.length < 2) {
      Alert.alert('Do rozpoczęcia gry potrzebujesz przynajmniej 2 graczy')
      return
    }

    socket.emit(
      'startGame',
      { accessCode, categories, rounds },
      (response: { success: boolean }) => {
        if (response.success) {
          Alert.alert('Gra rozpoczęta')
        } else {
          console.error('Błąd podczas rozpoczynania gry')
        }
      },
    )
  }

  if (players)
    return (
      <ScrollView style={styles.viewWrapper}>
        <View style={styles.accessInfoWrapper}>
          <MyText>Kod dostępu do gry</MyText>
          {/* <MyText>{accessCode}</MyText> */}
          <AccessCodeView accessCode={accessCode} />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 24,
          }}
        >
          <MyText>Ilość rund</MyText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 0,
              marginLeft: 24,
              borderWidth: 2,
              borderColor: '#f7cd6c',
              boxShadow: '2px 4px 5px rgba(0, 0, 0, 0.5)',
              borderRadius: 12,
              minWidth: 175,
              opacity: isHost ? 1 : 0.5,
            }}
          >
            <Pressable
              onPress={() => handleSetRounds('subtract')}
              style={{
                width: 64,
                backgroundColor: '#FDD988',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
            >
              <MyText align="center">-</MyText>
            </Pressable>

            <MyText align="center">{rounds.toString()}</MyText>

            <Pressable
              onPress={() => handleSetRounds('add')}
              style={{
                width: 64,
                backgroundColor: '#FDD988',
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <MyText align="center">+</MyText>
            </Pressable>
          </View>
        </View>

        <MyText>Wybrane kategorie: {categories.length}</MyText>
        <ScrollView style={styles.categoriesWrapper}>
          {availableCategories ? (
            availableCategories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryElement,
                  categories.includes(category.id) && {
                    backgroundColor: 'rgba(160, 23, 244, 0.5)',
                    borderRadius: 12,
                    padding: 6,
                  },
                ]}
                onPress={(e) => handleSelectCategory(category.id)}
              >
                <MyText>{category.name}</MyText>
              </Pressable>
            ))
          ) : (
            <MyText>Wczytywanie kategorii</MyText>
          )}
        </ScrollView>

        <MyText>Wszyscy gracze: {players.length}</MyText>
        <ScrollView style={styles.playersWrapper}>
          {players?.map((player) => (
            <View key={player.id} style={styles.playerElement}>
              <Image
                source={{ uri: player.avatar }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 100,
                  marginRight: 12,
                }}
              />
              <MyText>{player.playerName}</MyText>
            </View>
          ))}
        </ScrollView>

        {isHost ? (
          <MyButton onPress={handleStartGame}>
            <MyText align="center">Zaczynamy!</MyText>
          </MyButton>
        ) : (
          <MyText align="center">Czekaj na rozpoczęcie gry</MyText>
        )}

        <ExitGameButton onPress={() => handleExitGame()} />
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 36,
  },

  viewContent: {
    marginVertical: 12,
  },

  accessInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  categoriesWrapper: {
    maxHeight: 200,
    marginVertical: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 2,
    borderColor: '#FDD988',
    borderRadius: 24,
  },

  categoryElement: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',

    marginVertical: 6,
  },

  playersWrapper: {
    maxHeight: 200,
  },

  playerElement: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 2,
    borderColor: '#FDD988',
    borderRadius: 24,
  },
})
