import socket from '@/client/socket'
import { Player } from '@/store/lobbyStore'
import { Image, StyleSheet, View } from 'react-native'
import MyButton from './Button'
import MyText from './MyText'

type PlayerTurnViewProps = {
  players: Player[]
  playerTurnIndex: number
  currentPlayer: Player
  handlePlayerTurnReady: () => void
}

const PlayerTurnView: React.FC<PlayerTurnViewProps> = ({
  players,
  playerTurnIndex,
  currentPlayer,
  handlePlayerTurnReady,
}) => {
  const isCurrentPlayer = players[playerTurnIndex]?.id === socket.id

  return (
    <View key={players[playerTurnIndex]?.id} style={styles.container}>
      <View style={styles.currentPlayerContainer}>
        <Image
          source={{ uri: players[playerTurnIndex]?.avatar }}
          style={styles.image}
        />

        <MyText align="center" size="s">
          Odpowiada {currentPlayer.playerName}
        </MyText>
      </View>

      {isCurrentPlayer ? (
        <MyButton onPress={handlePlayerTurnReady}>
          <MyText align="center">Rzuć kością!</MyText>
        </MyButton>
      ) : (
        <MyText align="center" size="s" color="gray">
          Oczekiwanie na gracza...
        </MyText>
      )}
    </View>
  )
}

export default PlayerTurnView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  currentPlayerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: 156,
    height: 156,
    borderRadius: 100,
    marginBottom: 12,
    alignSelf: 'center',
  },
})
