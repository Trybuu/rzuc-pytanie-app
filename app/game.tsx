// Game.tsx
import socket from '@/client/socket'
import CategoryDisplay from '@/components/CategoryDisplay'
import GameOptions from '@/components/GameOptions'
import GameOverView from '@/components/GameOverView'
import GamePrepareQuestions from '@/components/GamePrepareQuestions'
import MyText from '@/components/MyText'
import PlayerAnswerView from '@/components/PlayerAnswerView'
import PlayerRollDiceView from '@/components/PlayerRollDiceView'
import PlayerShowAnswerView from '@/components/PlayerShowAnswerView'
import PlayersLeaderboard from '@/components/PlayersLeaderboard'
import PlayerTurnView from '@/components/PlayerTurnView'
import RoundNumberDisplay from '@/components/RoundNumberDisplay'
import { GameStatus, Lobby, Player, useLobbyStore } from '@/store/lobbyStore'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

const Game = () => {
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

  console.log('CURRENT CATEGORY INDEX', currentCategoryIndex)
  console.log('CURRENT CATEGORY', currentCategory)
  // const currentQuestions = players?.flatMap((p) => p.questions || []) // Nie używane

  const [isAnswerVisible, setAnswerVisible] = useState(false)

  useEffect(() => {
    if (socket.connected && socket.id) {
      setSocketId(socket.id)
    } else {
      socket.on('connect', () => {
        const socketId = socket.id ?? ''
        setSocketId(socketId)
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
      setPlayers(lobby.players)
    }

    const handleMarkedAnswerUpdated = (answer: string) => {
      console.log('Odpowiedź zaznaczona:', answer)
      setMarkedAnswer(answer)
    }

    const handleUpdatePlayerPoints = ({
      playerId,
      points,
    }: {
      playerId: string
      points: number
    }) => {
      setPlayerPoints(playerId, points)
    }

    const handlePlayerDisconected = (playerId: string) => {
      Alert.alert('Gracz rozłączył się', 'Gra zostanie zakończona.')

      if (socketId === playerId) {
        router.replace({ pathname: '/menu' })
      }
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

    const handleGameReset = (newLobbyState: Lobby) => {
      console.log('Gra została zresetowana')
      setLobby(newLobbyState)
      router.push({ pathname: '/lobby', params: { accessCode } })
    }

    socket.on('playersUpdated', handlePlayersUpdated)
    socket.on('gameStatusUpdated', handleGameStatusUpdated)
    socket.on('lobbyUpdated', handleLobbyUpdated)
    socket.on('markedAnswerUpdated', handleMarkedAnswerUpdated)
    socket.on('playerPointsUpdated', handleUpdatePlayerPoints)
    socket.on('playerDisconnected', handlePlayerDisconected)
    socket.on('hostUpdated', handleHostUpdated)
    socket.on('gameReset', handleGameReset)

    return () => {
      socket.off('playersUpdated', handlePlayersUpdated)
      socket.off('gameStatusUpdated', handleGameStatusUpdated)
      socket.off('lobbyUpdated', handleLobbyUpdated)
      socket.off('markedAnswerUpdated', handleMarkedAnswerUpdated)
      socket.off('playerPointsUpdated', handleUpdatePlayerPoints)
      socket.off('playerDisconnected', handlePlayerDisconected)
      socket.off('hostUpdated', handleHostUpdated)
      socket.off('gameReset', handleGameReset)
    }
  }, [
    setPlayers,
    setGameStatus,
    setLobby,
    setMarkedAnswer,
    setPlayerPoints,
    resetLobby,
    setHostId,
  ])

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

  const handleShowQuestion = () => {
    emitGameAction('showQuestion')
  }

  const handleNextPlayerTurn = () => {
    emitGameAction('nextPlayerTurn')
  }

  const handleShowAnswer = () => {
    emitGameAction('showAnswerPhase')
  }

  const handleSetMarkedAnswer = (answer: string) => {
    if (!isCurrentPlayer) return
    else {
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
  }

  const handleJudgePlayerAnswer = (playerId: string) => {
    socket.emit(
      'judgePlayerAnswer',
      { accessCode, playerId },
      (response: { success: boolean; message: string }) => {
        if (response.success) {
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
    router.push({
      pathname: '/menu',
    })
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
      <View style={styles.gameOptionsContainer}>
        <GameOptions />
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
    paddingVertical: 48,
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
