// Game.tsx
import socket from '@/client/socket'
import CategoryDisplay from '@/components/CategoryDisplay'
import GameOptions from '@/components/GameOptions'
import GameOverView from '@/components/GameOverView'
import GamePrepareQuestions from '@/components/GamePrepareQuestions'
import PlayerAnswerView from '@/components/PlayerAnswerView'
import PlayerRollDiceView from '@/components/PlayerRollDiceView'
import PlayerShowAnswerView from '@/components/PlayerShowAnswerView'
import PlayersLeaderboard from '@/components/PlayersLeaderboard'
import PlayerTurnView from '@/components/PlayerTurnView'
import RoundNumberDisplay from '@/components/RoundNumberDisplay'
import { GameStatus, Lobby, Player, useLobbyStore } from '@/store/lobbyStore'
import { useKeepAwake } from 'expo-keep-awake'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native'

const Game = () => {
  useKeepAwake()
  const [socketId, setSocketId] = useState<string>('')

  const {
    hostId,
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
    markedAnswer,
    setMarkedAnswer,
    setPlayerPoints,
    setHostId,
  } = useLobbyStore((state) => state)

  const currentPlayer = players[playerTurnIndex]
  const isCurrentPlayer = socketId === players[playerTurnIndex]?.id
  const playersReadyCount = players?.filter((p) => p.isReady).length
  const currentCategory = allCategories?.find(
    (c) => c.id === categories[currentCategoryIndex],
  )
  const router = useRouter()

  const [hostAlertShownFor, setHostAlertShownFor] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (socket.connected && socket.id) {
      setSocketId(socket.id)
    } else {
      socket.on('connect', () => {
        setSocketId(socket.id ?? '')
      })
    }
  }, [])

  useEffect(() => {
    const handlePlayerUpdated = ({
      targetPlayerId,
      targetPlayer,
    }: {
      targetPlayerId: string
      targetPlayer: Player
    }) => {
      setPlayer(targetPlayerId, targetPlayer)
    }

    socket.on('playerUpdated', handlePlayerUpdated)

    return () => {
      socket.off('playerUpdated', handlePlayerUpdated)
    }
  }, [setPlayer])

  useEffect(() => {
    const handlePlayersUpdated = (players: Player[]) => {
      setPlayers(players)
    }
    socket.on('playersUpdated', handlePlayersUpdated)
    return () => {
      socket.off('playersUpdated', handlePlayersUpdated)
    }
  }, [setPlayers])

  useEffect(() => {
    const handleGameStatusUpdated = (status: GameStatus) => {
      setGameStatus(status)
    }
    socket.on('gameStatusUpdated', handleGameStatusUpdated)
    return () => {
      socket.off('gameStatusUpdated', handleGameStatusUpdated)
    }
  }, [setGameStatus])

  useEffect(() => {
    const handleLobbyUpdated = (lobby: Lobby) => {
      setLobby(lobby)
      setPlayers(lobby.players)
    }
    socket.on('lobbyUpdated', handleLobbyUpdated)
    return () => {
      socket.off('lobbyUpdated', handleLobbyUpdated)
    }
  }, [setLobby, setPlayers])

  useEffect(() => {
    const handleMarkedAnswerUpdated = (answer: string) => {
      setMarkedAnswer(answer)
    }
    socket.on('markedAnswerUpdated', handleMarkedAnswerUpdated)
    return () => {
      socket.off('markedAnswerUpdated', handleMarkedAnswerUpdated)
    }
  }, [setMarkedAnswer])

  useEffect(() => {
    const handleUpdatePlayerPoints = ({
      playerId,
      points,
    }: {
      playerId: string
      points: number
    }) => {
      setPlayerPoints(playerId, points)
    }
    socket.on('playerPointsUpdated', handleUpdatePlayerPoints)
    return () => {
      socket.off('playerPointsUpdated', handleUpdatePlayerPoints)
    }
  }, [setPlayerPoints])

  useEffect(() => {
    const handlePlayerDisconnected = (playerId: string) => {
      Alert.alert('Gracz rozłączył się', 'Gra zostanie zakończona.')
      if (socketId === playerId) {
        router.replace({ pathname: '/menu' })
      }
    }
    socket.on('playerDisconnected', handlePlayerDisconnected)
    return () => {
      socket.off('playerDisconnected', handlePlayerDisconnected)
    }
  }, [socketId, router])

  useEffect(() => {
    const handleGameReset = ({
      lobby,
      players,
    }: {
      lobby: Lobby
      players: Player[]
    }) => {
      setLobby(lobby)
      setPlayers(players)
      router.push({ pathname: '/lobby', params: { accessCode } })
    }
    socket.on('gameReset', handleGameReset)
    return () => {
      socket.off('gameReset', handleGameReset)
    }
  }, [setLobby, setPlayers, router, accessCode])

  useEffect(() => {
    const handleHostUpdated = (hostId: string) => {
      setHostId(hostId)
      const newHost = players.find((p) => p.id === hostId)
      if (hostAlertShownFor !== hostId) {
        Alert.alert(
          'Zmieniono gospodarza rozgrywki',
          'Nowy gospodarz: ' + newHost?.playerName,
        )
        setHostAlertShownFor(hostId)
      }
    }
    socket.on('hostUpdated', handleHostUpdated)
    return () => {
      socket.off('hostUpdated', handleHostUpdated)
    }
  }, [players, hostAlertShownFor, setHostId])

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
  }

  const handlePlayerTurnReady = () => emitGameAction('playerTurn')
  const handleRollingDice = () => emitGameAction('rollTheDice')
  const handleShowQuestion = () => emitGameAction('showQuestion')
  const handleNextPlayerTurn = () => emitGameAction('nextPlayerTurn')
  const handleShowAnswer = () => emitGameAction('showAnswerPhase')

  const handleSetMarkedAnswer = (answer: string) => {
    if (!isCurrentPlayer) return
    socket.emit(
      'setMarkedAnswer',
      { accessCode, answer },
      (response: { success: boolean }) => {
        if (response.success) {
          setMarkedAnswer(answer)
        } else {
          console.error('Błąd podczas ustawiania zaznaczonej odpowiedzi')
        }
      },
    )
  }

  const handleJudgePlayerAnswer = (playerId: string) => {
    socket.emit(
      'judgePlayerAnswer',
      { accessCode, playerId },
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          console.log('EMIT judgePlayerAnswer', { accessCode, playerId })
          console.trace('EMIT trace')
          console.log(response.message)
        } else {
          console.log(response.message)
        }
      },
    )
  }

  const handleExitLobby = () => {
    socket.disconnect()
    resetLobby()
    router.push({ pathname: '/menu' })
    socket.connect()
  }

  const handlePlayAgain = () => {
    socket.emit(
      'playAgain',
      { accessCode },
      (response: { success: boolean; message: string }) => {
        if (response.success) {
          console.log('Gra zostanie wznowiona!')
        } else {
          console.log('Błąd podczas próby wznowienia gry:', response.message)
        }
      },
    )
  }

  const renderGameContent = (gameStatus: GameStatus) => {
    switch (gameStatus) {
      case 'startingGame':
        return (
          <PlayerTurnView
            players={players}
            currentPlayer={currentPlayer}
            playerTurnIndex={playerTurnIndex}
            handlePlayerTurnReady={handlePlayerTurnReady}
          />
        )
      case 'rollingDicePhase':
        return (
          <PlayerRollDiceView
            currentPlayer={currentPlayer}
            isCurrentPlayer={isCurrentPlayer}
            lastDiceRoll={lastDiceRoll}
            handleRollingDice={handleRollingDice}
            handleShowQuestion={handleShowQuestion}
          />
        )
      case 'questionPhase':
        return (
          <PlayerAnswerView
            lastDiceRoll={lastDiceRoll}
            drawnQuestion={drawnQuestion}
            questionAnswer={questionAnswer}
            isCurrentPlayer={isCurrentPlayer}
            markedAnswer={markedAnswer}
            handleNextPlayerTurn={handleNextPlayerTurn}
            handleShowAnswer={handleShowAnswer}
            handleSetMarkedAnswer={handleSetMarkedAnswer}
          />
        )
      case 'showAnswerPhase':
        return (
          <PlayerShowAnswerView
            playerId={socketId}
            drawnQuestion={drawnQuestion}
            questionAnswer={questionAnswer}
            isCurrentPlayer={isCurrentPlayer}
            markedAnswer={markedAnswer}
            handleNextPlayerTurn={handleNextPlayerTurn}
            handleSetMarkedAnswer={handleSetMarkedAnswer}
            handleJudgePlayerAnswer={handleJudgePlayerAnswer}
          />
        )
      case 'gameOver':
        return (
          <GameOverView hostId={hostId} handlePlayAgain={handlePlayAgain} />
        )
      default:
        return <ActivityIndicator color="#FDD988" />
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
      <View style={styles.gameOptionsContainer}>
        <GameOptions handleExitLobby={handleExitLobby} />
      </View>
      <View style={styles.gameHeader}>
        <CategoryDisplay categoryName={currentCategory?.name} />
        <RoundNumberDisplay currentRound={currentRound} roundsTotal={rounds} />
      </View>
      <PlayersLeaderboard players={players} playerId={socketId} />
      <View style={styles.gameBody}>{renderGameContent(gameStatus)}</View>
    </View>
  )
}

export default Game

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    padding: 24,
  },
  viewContent: {
    marginVertical: 12,
    paddingHorizontal: 24,
    paddingVertical: 54,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  gameBody: {
    flex: 1,
    paddingVertical: 12,
  },
})
