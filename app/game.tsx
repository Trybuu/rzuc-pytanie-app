import socket from '@/client/socket'
import GamePrepareQuestions from '@/components/GamePrepareQuestions'
import MyText from '@/components/MyText'
import { Player, useLobbyStore } from '@/store/lobbyStore'
import { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'

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
    currentRound,
    playerTurnIndex,
  } = useLobbyStore((state) => state)

  const playersReadyCount = players?.filter((p) => p.isReady).length
  const currentCategory = allCategories?.find((c) => c.id === categories[0])
  const currentQuestions = players?.flatMap((p) => p.questions || [])

  type GameStatus =
    | 'changingPlayer'
    | 'playerTurn'
    | 'questionPhase'
    | 'gameOver'

  let gameStatus: GameStatus = 'changingPlayer'

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

  const renderGameScreen = (status: GameStatus) => {
    switch (status) {
      case 'changingPlayer':
        return (
          <View
            key={players[playerTurnIndex].id}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: players[playerTurnIndex].avatar }}
              style={{
                width: 156,
                height: 156,
                borderRadius: 100,
                marginBottom: 12,
              }}
            />
            <MyText>Odpowiada {players[playerTurnIndex].playerName}</MyText>
          </View>
        )

      case 'playerTurn':
        return <MyText>Rzuć kością</MyText>

      case 'questionPhase':
        return <MyText>Wyświetl pytanie zgodnie z wylosowaną liczbą</MyText>

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

      <ScrollView style={styles.gameBody}>
        {renderGameScreen(gameStatus)}
      </ScrollView>
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
    paddingVertical: 12,
    backgroundColor: 'orange',
  },
})
