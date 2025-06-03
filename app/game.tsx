import socket from '@/client/socket'
import MyButton from '@/components/Button'
import MyText from '@/components/MyText'
import { Player, useLobbyStore } from '@/store/lobbyStore'
import { useEffect, useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'

const Game = () => {
  const dieImages = [
    require('@/assets/images/regular_dies/die1.png'),
    require('@/assets/images/regular_dies/die2.png'),
    require('@/assets/images/regular_dies/die3.png'),
    require('@/assets/images/regular_dies/die4.png'),
    require('@/assets/images/regular_dies/die5.png'),
    require('@/assets/images/regular_dies/die6.png'),
  ]
  const inputIds = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6']
  const [inputValues, setInputValues] = useState<string[]>(
    Array(inputIds.length).fill(''),
  )

  const [socketId, setSocketId] = useState<string | undefined>()
  const {
    accessCode,
    players,
    hasCustomCategory,
    allCategories,
    categories,
    setPlayer,
    setLobby,
    setPlayers,
    currentRound,
    roundsTotal,
    playerTurnIndex,
  } = useLobbyStore((state) => state)
  const player = players.find((p) => p.id === socketId)
  const questionsTargetId = players.find(
    (p) => p.id === socketId,
  )?.questionsTargetPlayerId
  const questionTargetPlayer = players.find((p) => p.id === questionsTargetId)
  const playersReadyCount = players.filter((p) => p.isReady).length

  const currentCategory = allCategories?.find((c) => c.id === categories[0])

  useEffect(() => {
    if (socket.connected) {
      setSocketId(socket.id)
    } else {
      socket.on('connect', () => {
        setSocketId(socket.id)
      })
    }
  }, [])

  useEffect(() => {
    const handlePlayerUpdated = ({
      id,
      targetPlayer,
    }: {
      id: string
      targetPlayer: Player
    }) => {
      setPlayer(id, targetPlayer)
    }

    socket.on('playerUpdated', handlePlayerUpdated)

    return () => {
      socket.off('playerUpdated', handlePlayerUpdated)
    }
  }, [])

  useEffect(() => {
    const handlePlayersUpdated = (players: Player[]) => {
      setPlayers(players)
    }

    socket.on('playersUpdated', handlePlayersUpdated)

    return () => {
      socket.off('playersUpdated', handlePlayersUpdated)
    }
  }, [])

  useEffect(() => {
    const current = players.find((p) => p.id === socket.id)
    console.log('Aktualny gracz:', current)
  }, [players])

  const handleChangeInputValue = (value: string, index: number) => {
    setInputValues((prevValues: string[]) => {
      const newValues = [...prevValues]
      newValues[index] = value
      return newValues
    })
  }

  // W komponencie Game, w funkcji handleReadyChange
  const handleReadyChange = (isReady: boolean) => {
    if (inputValues.some((value) => value.trim() === '')) {
      Alert.alert('Wszystkie pola muszą zostać wypełnione')
      return
    }

    socket.emit(
      'readyChange',
      { accessCode, playerId: socketId, isReady },
      (response: {
        success: boolean
        message?: string
        arePlayersReady: boolean // Nadal potrzebne do synchronizacji startu gry
      }) => {
        if (!response.success) {
          console.error('Błąd zmiany gotowości:', response.message)
        } else {
          const questions = inputValues.map((value, index) => ({
            id: index,
            question: value.trim(),
            isCustomQuestion: true,
            answers: null,
            points: null,
            isAnswered: false,
          }))

          // Wyślij pytania, gdy tylko gracz jest gotowy
          if (isReady) {
            socket.emit(
              'prepareQuestions',
              {
                accessCode,
                playerId: socketId,
                questions,
              },
              (response: { success: boolean }) => {
                if (response.success) {
                  console.log('Pytania ustawione dla gracza', socketId)
                } else {
                  console.error('Błąd podczas ustawiania pytań')
                }
              },
            )
          }
        }
      },
    )
  }

  if (hasCustomCategory && playersReadyCount < players.length)
    return (
      <ScrollView style={styles.viewWrapper}>
        <View>
          <MyText align="center" size="l">
            Dodaj własne pytania
          </MyText>
          <View>
            <MyText align="center">Zadajesz pytania graczowi</MyText>
            <MyText align="center" color="orange">
              {questionTargetPlayer?.playerName}
            </MyText>
          </View>
          <MyText align="center" size="s" color="gray">
            Im więcej oczek tym pytanie powinno być trudniejsze. Pytania te są
            anonimowe. Pytania mogą być najróżniejsze, od sprawdzenia wiedzy z
            różnych kategorii aż po sferę prywatną. Daj upust swojej wyobraźni!
          </MyText>
        </View>

        <View>
          {inputIds.map((input, index) => (
            <View key={input}>
              <MyText align="left" size="s" color="gray">
                Pytanie {index + 1}
              </MyText>
              <View style={styles.inputWrapper}>
                <Image
                  source={dieImages[index]}
                  style={{ width: 24, height: 24 }}
                />
                <TextInput
                  style={styles.textInput}
                  value={inputValues[index]}
                  onChange={(e) =>
                    handleChangeInputValue(e.nativeEvent.text, index)
                  }
                ></TextInput>
              </View>
            </View>
          ))}
        </View>

        <MyButton
          bgColor={player?.isReady ? 'green' : 'red'}
          onPress={() => handleReadyChange(!player?.isReady)}
        >
          <MyText align="center">
            {player?.isReady ? 'Gotów' : 'Niegotowy'}
          </MyText>
        </MyButton>

        <MyText align="center" size="s" color="gray">
          {player?.isReady
            ? 'Jesteś gotowy, czekaj na rozpoczęcie gry'
            : 'Aktualnie jesteś niegotowy'}
        </MyText>
        <MyText align="center" size="s" color="gray">
          {playersReadyCount} / {players.length} graczy gotowych
        </MyText>
      </ScrollView>
    )

  if (playersReadyCount === players.length)
    return (
      <View style={styles.viewWrapper}>
        <View style={styles.gameHeader}>
          <MyText>{currentCategory?.name}</MyText>
          <MyText>Runda: {currentRound}</MyText>
        </View>
        <MyText>Gracz: {players[playerTurnIndex].playerName}</MyText>
        <MyText>Gracze gotowi zaczynamy Grę</MyText>
      </View>
    )

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.gameHeader}>
        <MyText>Kategoria</MyText>
        <MyText>Runda 1</MyText>
      </View>
      <MyText>Gracz: </MyText>
      <MyText>Game Screen</MyText>
    </View>
  )
}

export default Game

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    backgroundColor: '#2B2F41',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  viewContent: {
    marginVertical: 12,
  },

  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    padding: 12,
    borderWidth: 2,
    borderColor: '#FF9D00',
    borderRadius: 24,
  },

  textInput: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'MuseoModerno',
  },
})
