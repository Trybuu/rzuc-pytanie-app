// Game.tsx
import socket from '@/client/socket'
import MyButton from '@/components/Button'
import CategoryDisplay from '@/components/CategoryDisplay'
import GamePrepareQuestions from '@/components/GamePrepareQuestions'
import MyText from '@/components/MyText'
import PlayerAnswerView from '@/components/PlayerAnswerView'
import PlayerRollDiceView from '@/components/PlayerRollDiceView'
import PlayerShowAnswerView from '@/components/PlayerShowAnswerView'
import PlayersLeaderboard from '@/components/PlayersLeaderboard'
import PlayerTurnView from '@/components/PlayerTurnView'
import RoundNumberDisplay from '@/components/RoundNumberDisplay'
import { GameStatus, Lobby, Player, useLobbyStore } from '@/store/lobbyStore'
import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

const Game = () => {
  const [socketId, setSocketId] = useState<string>('')
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
    markedAnswer,
    setMarkedAnswer,
    setPlayerPoints,
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

    socket.on('playersUpdated', handlePlayersUpdated)
    socket.on('gameStatusUpdated', handleGameStatusUpdated)
    socket.on('lobbyUpdated', handleLobbyUpdated)
    socket.on('markedAnswerUpdated', handleMarkedAnswerUpdated)
    socket.on('playerPointsUpdated', handleUpdatePlayerPoints)

    return () => {
      socket.off('playersUpdated', handlePlayersUpdated)
      socket.off('gameStatusUpdated', handleGameStatusUpdated)
      socket.off('lobbyUpdated', handleLobbyUpdated)
      socket.off('markedAnswerUpdated', handleMarkedAnswerUpdated)
      socket.off('playerPointsUpdated', handleUpdatePlayerPoints)
    }
  }, [setPlayers, setGameStatus, setLobby, setMarkedAnswer, setPlayerPoints])

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
            handleRollingDice={handleRollingDice}
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

  gameBody: {
    flex: 1,
    paddingVertical: 12,
  },
})
