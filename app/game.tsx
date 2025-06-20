// Game.tsx
import socket from '@/client/socket'
import MyButton from '@/components/Button'
import GamePrepareQuestions from '@/components/GamePrepareQuestions'
import MyText from '@/components/MyText'
import { GameStatus, Lobby, Player, useLobbyStore } from '@/store/lobbyStore'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'

const Game = () => {
  const [socketId, setSocketId] = useState<string | undefined>()
  const {
    accessCode,
    players,
    hasCustomCategory,
    allCategories,
    categories,
    currentCategoryIndex,
    setPlayer,
    setPlayers,
    resetLobby,
    setGameStatus,
    currentRound,
    rounds,
    playerTurnIndex,
    gameStatus,
    setLobby,
    lastDiceRoll,
    drawnQuestion,
    questionAnswer,
  } = useLobbyStore((state) => state)

  const currentPlayer = players[playerTurnIndex]
  const isCurrentPlayer = socketId === players[playerTurnIndex]?.id
  const playersReadyCount = players?.filter((p) => p.isReady).length
  const currentCategory = allCategories?.find(
    (c) => c.id === categories[currentCategoryIndex],
  )

  console.log('CURRENT CATEGORY INDEX', currentCategoryIndex)
  console.log('CURRENT CATEGORY', currentCategory)
  // const currentQuestions = players?.flatMap((p) => p.questions || []) // Nie używane

  const [isAnswerVisible, setAnswerVisible] = useState(false)

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

    const handleGameStatusUpdated = (status: GameStatus) => {
      setGameStatus(status)
    }

    const handleLobbyUpdated = (lobby: Lobby) => {
      setLobby(lobby)
    }

    socket.on('playersUpdated', handlePlayersUpdated)
    socket.on('gameStatusUpdated', handleGameStatusUpdated)
    socket.on('lobbyUpdated', handleLobbyUpdated)

    return () => {
      socket.off('playersUpdated', handlePlayersUpdated)
      socket.off('gameStatusUpdated', handleGameStatusUpdated)
      socket.off('lobbyUpdated', handleLobbyUpdated)
    }
  }, [setPlayers, setGameStatus, setLobby])

  useEffect(() => {
    const current = players.find((p) => p.id === socket.id)
    console.log('Aktualny gracz:', current)
  }, [players])

  const emitGameAction = (newStatus: GameStatus, data?: any) => {
    socket.emit(
      'changeGameStatus',
      { accessCode, newStatus, data },
      (response: { success: boolean; message: string }) => {
        if (!response.success) {
          console.error('Błąd zmiany statusu gry:', response.message)
          return
        }
        console.log(`Wysłano żądanie zmiany statusu gry na: ${newStatus}`)
      },
    )
    console.log('wysłany status na serwer', newStatus)
  }

  const handlePlayerTurnReady = () => {
    emitGameAction('playerTurn')
  }

  const handleRollingDice = () => {
    emitGameAction('rollTheDice')
  }

  const handleNextPlayerTurn = () => {
    emitGameAction('nextPlayerTurn')
  }

  const handleShowAnswer = () => {
    emitGameAction('showAnswerPhase')
  }

  const handleExitLobby = () => {
    socket.disconnect()
    resetLobby()
    router.push({
      pathname: '/menu',
    })
    socket.connect()
  }

  const renderGameContent = (gameStatus: GameStatus) => {
    console.log('Aktualny status gry:', gameStatus)
    switch (gameStatus) {
      case 'startingGame':
        return (
          <View key={players[playerTurnIndex]?.id}>
            <Image
              source={{ uri: players[playerTurnIndex]?.avatar }}
              style={{
                width: 156,
                height: 156,
                borderRadius: 100,
                marginBottom: 12,
              }}
            />
            <MyText>Odpowiada {currentPlayer.playerName}</MyText>

            {isCurrentPlayer ? (
              <MyButton onPress={() => handlePlayerTurnReady()}>
                <MyText align="center">Lecimy!</MyText>
              </MyButton>
            ) : (
              <MyText align="center" size="s" color="gray">
                Oczekiwanie na gracza...
              </MyText>
            )}
          </View>
        )

      case 'rollingDicePhase':
        return (
          <View>
            {isCurrentPlayer ? (
              <MyText align="center" size="s">
                Rzucaj kością!
              </MyText>
            ) : null}
            {isCurrentPlayer ? (
              <MyButton onPress={() => handleRollingDice()}>
                <MyText align="center">Rzut kością</MyText>
              </MyButton>
            ) : (
              <MyText align="center" size="s">
                Czekaj na rzut gracza {currentPlayer.playerName}
              </MyText>
            )}
          </View>
        )

      case 'questionPhase':
        return (
          <View>
            <MyText align="center" size="l">
              Odpowiada {currentPlayer.playerName}
            </MyText>

            {lastDiceRoll && drawnQuestion && (
              <View>
                <MyText align="center" size="m">
                  Wyrzucono {lastDiceRoll}
                </MyText>
                <MyText align="center" size="m">
                  {drawnQuestion.question}
                </MyText>

                {/* Jeśli jest odpowiedź na pytanie zmień status gry na fazę sprawdzenia odpowiedzi */}
                {isCurrentPlayer && questionAnswer && (
                  <MyButton onPress={handleShowAnswer}>
                    <MyText align="center">Sprawdź odpowiedź</MyText>
                  </MyButton>
                )}

                {/* Jeśli nie ma odpowiedzi na pytanie. Wyświetl przycisk przejścia do kolejnego gracza */}
                {isCurrentPlayer && !questionAnswer && (
                  <MyButton onPress={handleNextPlayerTurn}>
                    <MyText align="center">Kolejna osoba</MyText>
                  </MyButton>
                )}
              </View>
            )}
          </View>
        )

      case 'showAnswerPhase':
        return (
          <View>
            <MyText align="center" size="s">
              Poprawna odpowiedź to
            </MyText>
            <MyText align="center" size="l" color="orange">
              {questionAnswer}
            </MyText>

            {isCurrentPlayer && (
              <MyButton onPress={handleNextPlayerTurn}>
                <MyText align="center">Kolejna osoba</MyText>
              </MyButton>
            )}
          </View>
        )

      case 'gameOver':
        return (
          <View>
            <MyText>Gra zakończona</MyText>
            <MyButton bgColor="red" onPress={() => handleExitLobby()}>
              <MyText align="center">Opuść Lobby</MyText>
            </MyButton>
          </View>
        )

      default:
        return <MyText>Wczytywanie...</MyText>
    }
  }

  if (socket.id && hasCustomCategory && playersReadyCount < players.length)
    return (
      <GamePrepareQuestions
        players={players}
        accessCode={accessCode}
        playerId={socket.id}
      />
    )

  return (
    <View style={styles.viewWrapper}>
      <View style={styles.gameHeader}>
        <MyText>{currentCategory?.name}</MyText>
        <MyText>
          Runda: {currentRound} / {rounds}
        </MyText>
      </View>

      {/* Wywołujemy nową, czystą funkcję renderującą */}
      <View style={styles.gameBody}>{renderGameContent(gameStatus)}</View>
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

  gameBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
})
