import { Category, getCategories } from '@/api/category'
import { socketEditLobby } from '@/client/events'
import socket from '@/client/socket'
import AccessCodeView from '@/components/AccessCodeView'
import MyButton from '@/components/Button'
import MyText from '@/components/MyText'
import { Lobby as LobbyType, useLobbyStore } from '@/store/lobbyStore'
import Feather from '@expo/vector-icons/Feather'
import { router, useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'

export default function Lobby() {
  const navigation = useNavigation()

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
    setHostId,
  } = useLobbyStore()

  const playerSocketId = socket.id
  const isHost = playerSocketId === hostId

  const [availableCategories, setAvailableCategories] = useState<
    Category[] | null
  >(null)
  const [canStartGame, setCanStartGame] = useState(false)
  const [waitingForGameStart, setWaitingForGameStart] = useState(false)
  const [isGameStarting, setIsGameStarting] = useState(false)

  useEffect(() => {
    const listener = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      navigation.dispatch(e.data.action)
    })

    return () => {
      listener()
    }
  })

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
      setIsGameStarting(true)
      setLobby(lobbyData)

      setTimeout(() => {
        router.replace({
          pathname: '/game',
          params: { accessCode: lobbyData.accessCode },
        })
      }, 3000)
    }

    const handleHostUpdated = (hostId: string) => {
      setHostId(hostId)

      const newHost = players.find((p) => p.id === hostId)
      Alert.alert(
        'Zmieniono gospodarza rozgrywki',
        'Nowy gospodarz: ' + newHost?.playerName,
      )
      console.log('ZMIANA HOSTA!!!: 🥳🥳🥳', hostId)
    }

    socket.on('lobbyCreated', handleLobbyCreated)
    socket.on('lobbyUpdated', handleLobbyUpdated)
    socket.on('gameStarted', handleGameStarted)
    socket.on('hostUpdated', handleHostUpdated)

    return () => {
      socket.off('lobbyCreated', handleLobbyCreated)
      socket.off('lobbyUpdated', handleLobbyUpdated)
      socket.off('gameStarted', handleGameStarted)
      socket.off('hostUpdated', handleHostUpdated)
    }
  }, [setPlayers, setRounds, setCategoryList, setHostId])

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()
      setAvailableCategories(categories)
      console.log(categories)
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    if (players.length >= 2 && categories.length >= 1) {
      setCanStartGame(true)
    } else {
      setCanStartGame(false)
    }
  }, [players, categories])

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

  const handleSelectCategory = (id: number) => {
    if (!isHost) return
    toggleCategory(accessCode, id)
  }

  const handleExitGame = () => {
    router.replace({
      pathname: '/menu',
    })
    resetLobby()
    socket.disconnect()
    socket.connect()
  }

  const handleStartGame = () => {
    if (!isHost || waitingForGameStart) return

    if (categories.length < 1) {
      Alert.alert('Wybierz przynajmniej jedną kategorię pytań')
      return
    } else if (players.length < 2) {
      Alert.alert('Do rozpoczęcia gry potrzebujesz przynajmniej 2 graczy')
      return
    }

    setWaitingForGameStart(true)

    socket.emit(
      'startGame',
      { accessCode, categories, rounds },
      (response: { success: boolean }) => {
        setWaitingForGameStart(false)

        if (!response.success) {
          Alert.alert('Nie udało się rozpocząć gry')
        }
      },
    )
  }

  const handleShowCategoryDesc = (id: number) => {
    const category = availableCategories?.find((c) => c.id === id)
    if (category) {
      Alert.alert(category.name, category.description)
    } else {
      Alert.alert('Kategoria nie znaleziona')
    }
  }

  // EKRAN ŁADOWANIA PRZED WEJŚCIEM DO GRY
  if (isGameStarting) {
    return (
      <View style={styles.loadingWrapper}>
        <MyText align="center" color="white">
          Zaczynamy!
        </MyText>
        <ActivityIndicator size="large" color="#EDCC71" />
      </View>
    )
  }

  if (players)
    return (
      <ScrollView style={styles.viewWrapper}>
        <View style={styles.accessInfoWrapper}>
          <MyText>Kod dostępu do gry</MyText>
          <AccessCodeView accessCode={accessCode} />
        </View>

        <View style={styles.roundsControl}>
          <MyText>Ilość rund</MyText>
          <View style={[styles.roundsBox, { opacity: isHost ? 1 : 0.5 }]}>
            <Pressable
              onPress={() => handleSetRounds('subtract')}
              style={styles.roundButton}
            >
              <MyText align="center">-</MyText>
            </Pressable>

            <MyText align="center">{rounds.toString()}</MyText>

            <Pressable
              onPress={() => handleSetRounds('add')}
              style={styles.roundButton}
            >
              <MyText align="center">+</MyText>
            </Pressable>
          </View>
        </View>

        <MyText>Wybrane kategorie: {categories.length}</MyText>
        <ScrollView style={styles.categoriesWrapper}>
          {availableCategories ? (
            availableCategories.map((category) => (
              <View
                key={category.id}
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Pressable
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
                  <View style={{ marginRight: 6 }}>
                    <MyText>{category.icon}</MyText>
                  </View>

                  <View style={{ flex: 1 }}>
                    <MyText align="left">{category.name}</MyText>
                  </View>
                </Pressable>
                <Pressable onPress={() => handleShowCategoryDesc(category.id)}>
                  <Feather
                    name="info"
                    size={22}
                    color="rgba(160, 23, 244, 0.5)"
                    style={{ marginLeft: 6 }}
                  />
                </Pressable>
              </View>
            ))
          ) : (
            <MyText>Wczytywanie kategorii...</MyText>
          )}
        </ScrollView>

        <MyText>Wszyscy gracze: {players.length}</MyText>
        <ScrollView style={styles.playersWrapper}>
          {players?.map((player) => (
            <View key={player.id} style={styles.playerElement}>
              <Image
                source={{ uri: player.avatar }}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 100,
                  marginRight: 12,
                }}
              />
              <MyText>{player.playerName}</MyText>
            </View>
          ))}
        </ScrollView>

        <View style={styles.controlButtonsContainer}>
          {isHost ? (
            <MyButton
              onPress={handleStartGame}
              disabled={!canStartGame || waitingForGameStart}
            >
              <MyText align="center">
                {waitingForGameStart ? 'Czekaj...' : 'Zaczynamy!'}
              </MyText>
            </MyButton>
          ) : (
            <MyText align="center">Czekaj na rozpoczęcie gry</MyText>
          )}

          <MyButton bgColor="red" onPress={() => handleExitGame()}>
            <MyText align="center">Opuść lobby</MyText>
          </MyButton>
        </View>
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 54,
  },
  accessInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roundsControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  roundsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 24,
    borderWidth: 2,
    borderColor: '#f7cd6c',
    borderRadius: 12,
    minWidth: 175,
  },
  roundButton: {
    width: 64,
    backgroundColor: '#FDD988',
    borderRadius: 8,
  },
  categoriesWrapper: {
    maxHeight: 200,
    marginVertical: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth: 2,
    borderColor: '#FDD988',
    borderRadius: 24,
  },
  categoryElement: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  playersWrapper: {
    maxHeight: 220,
  },
  playerElement: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderWidth: 2,
    borderColor: '#FDD988',
    borderRadius: 24,
  },
  controlButtonsContainer: {
    paddingVertical: 24,
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
})
