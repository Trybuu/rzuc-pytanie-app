// Game.tsx
import socket from '@/client/socket'
import MyButton from '@/components/Button'
import GamePrepareQuestions from '@/components/GamePrepareQuestions'
import MyText from '@/components/MyText'
import { GameStatus, Player, useLobbyStore } from '@/store/lobbyStore'
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
    setPlayer,
    setPlayers,
    setGameStatus,
    currentRound,
    playerTurnIndex,
    gameStatus,
  } = useLobbyStore((state) => state)

  const playersReadyCount = players?.filter((p) => p.isReady).length
  const currentCategory = allCategories?.find((c) => c.id === categories[0])
  // const currentQuestions = players?.flatMap((p) => p.questions || []) // Nie używane

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

    socket.on('playersUpdated', handlePlayersUpdated)
    socket.on('gameStatusUpdated', handleGameStatusUpdated)

    return () => {
      socket.off('playersUpdated', handlePlayersUpdated)
      socket.off('gameStatusUpdated', handleGameStatusUpdated)
    }
  }, [setPlayers, setGameStatus])

  useEffect(() => {
    const current = players.find((p) => p.id === socket.id)
    console.log('Aktualny gracz:', current)
  }, [players])

  const handleChangeGameStatus = (newStatus: GameStatus) => {
    socket.emit('changeGameStatus', { accessCode, newStatus }, () => {
      console.log(`Wysłano żądanie zmiany statusu gry na: ${newStatus}`)
    })
    console.log('wysłany status na serwer', newStatus)
  }

  const renderGameContent = (gameStatus: GameStatus) => {
    console.log('Aktualny status gry:', gameStatus)
    switch (gameStatus) {
      case 'changingPlayer':
        return (
          <View
            key={players[playerTurnIndex]?.id}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: players[playerTurnIndex]?.avatar }}
              style={{
                width: 156,
                height: 156,
                borderRadius: 100,
                marginBottom: 12,
              }}
            />
            <MyText>Odpowiada {players[playerTurnIndex]?.playerName}</MyText>

            <MyButton onPress={() => handleChangeGameStatus('playerTurn')}>
              <MyText>Okej!</MyText>
            </MyButton>
          </View>
        )

      case 'playerTurn':
        return (
          <View>
            <MyText>Rzuć kością!</MyText>
            <MyButton>Rzut kością</MyButton>
            <MyText size="s">
              Programowalne przejście do pytania, docelowo gracz rzuca kością
              gra czeka 3 sekundy i zmienia status
            </MyText>
            <MyButton onPress={() => handleChangeGameStatus('questionPhase')}>
              <MyText align="center">Okej!</MyText>
            </MyButton>
          </View>
        )

      case 'questionPhase':
        return (
          <View>
            <MyText>Faza odpowiadania na pytanie</MyText>
            <MyText size="s">Programowalne przejście do końca gry</MyText>
            <MyButton onPress={() => handleChangeGameStatus('gameOver')}>
              <MyText align="center">Okej!</MyText>
            </MyButton>
          </View>
        )

      case 'gameOver':
        return <MyText>Gra zakończona</MyText>

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
        <MyText>Runda: {currentRound}</MyText>
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
