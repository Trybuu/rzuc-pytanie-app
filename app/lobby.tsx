import { Category, getCategories } from '@/api/category'
import socket from '@/client/socket'
import MyButton from '@/components/Button'
import MyText from '@/components/MyText'
import { Lobby as LobbyType, useLobbyStore } from '@/store/lobbyStore'
import { useNavigation } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'

export default function Lobby() {
  const navigation = useNavigation()

  // Wykorzystanie danych z lobbyStore
  const { accessCode, players, hostId } = useLobbyStore((state) => state)
  const { createLobby, setPlayers } = useLobbyStore()

  // Czy gracz jest hostem rozgrywki
  const playerSocketId = socket.id
  const isHost = playerSocketId === hostId

  // Wczytanie danych z API
  const [categories, setCategories] = useState<Category[] | null>(null)

  // Ustawienie zasad rozgrywki
  const [rounds, setRounds] = useState<string>('1')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

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
      createLobby(lobbyData)
    }

    const handleLobbyUpdated = (lobbyData: LobbyType) => {
      setPlayers(lobbyData.players)
    }

    socket.on('lobbyCreated', handleLobbyCreated)
    socket.on('lobbyUpdated', handleLobbyUpdated)

    return () => {
      socket.off('lobbyCreated', handleLobbyCreated)
      socket.off('lobbyUpdated', handleLobbyUpdated)
    }
  }, [createLobby, setPlayers])

  // Zapytania do API
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()

      setCategories(categories)
      console.log(categories)
    }

    fetchCategories()
  }, [])

  // Aktualizuj wartość ilości rund w rozgrywce
  const handleSetRounds = (action: 'add' | 'subtract'): void => {
    if (!isHost) return

    const roundsNumber: number = parseInt(rounds)

    if (action === 'add') {
      if (roundsNumber < 6) {
        const newRoundsNumber = roundsNumber + 1
        setRounds(newRoundsNumber.toString())
      }
    }

    if (action === 'subtract') {
      if (roundsNumber > 1) {
        const newRoundsNumber = roundsNumber - 1
        setRounds(newRoundsNumber.toString())
      }
    }
  }

  // Aktualizuj wybrane kategorie pytań
  const handleSelectCategory = (id: number) => {
    if (!isHost) return

    const newCategories = [...selectedCategories]

    if (selectedCategories.includes(id)) {
      newCategories.splice(selectedCategories.indexOf(id), 1)
    } else {
      newCategories.push(id)
    }

    setSelectedCategories(newCategories)
  }

  if (players)
    return (
      <ScrollView style={styles.viewWrapper}>
        <MyText>{playerSocketId === hostId ? 'admin' : 'gracz'}</MyText>
        <View style={styles.accessInfoWrapper}>
          <MyText>Kod dostępu do gry</MyText>
          <MyText>{accessCode}</MyText>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
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
              borderColor: '#FF9D00',
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
                backgroundColor: '#FF9D00',
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
            >
              <MyText align="center">-</MyText>
            </Pressable>

            <MyText align="center">{rounds}</MyText>

            <Pressable
              onPress={() => handleSetRounds('add')}
              style={{
                width: 64,
                backgroundColor: '#FF9D00',
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            >
              <MyText align="center">+</MyText>
            </Pressable>
          </View>
        </View>

        <View>
          <MyText>Wybrane kategorie: {selectedCategories.length}</MyText>
          <ScrollView style={styles.categoriesWrapper}>
            {categories ? (
              categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryElement,
                    selectedCategories.includes(category.id) && {
                      borderWidth: 2,
                      borderColor: 'orange',
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
        </View>

        <ScrollView style={styles.playersWrapper}>
          <MyText>Wszyscy gracze: {players.length}</MyText>
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
          <MyButton>
            <MyText align="center">Zaczynamy!</MyText>
          </MyButton>
        ) : (
          <MyText align="center">Czekaj na rozpoczęcie gry</MyText>
        )}
      </ScrollView>
    )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    backgroundColor: '#2B2F41',
    padding: 24,
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
    borderWidth: 2,
    borderColor: '#FF9D00',
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
    borderWidth: 2,
    borderColor: '#FF9D00',
    borderRadius: 24,
  },
})
