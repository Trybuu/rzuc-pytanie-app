import { Player } from '@/store/lobbyStore'
import { StyleSheet, View } from 'react-native'
import MyButton from './Button'
import MyText from './MyText'

type PlayerRollDiceViewProps = {
  isCurrentPlayer: boolean
  currentPlayer: Player
  handleRollingDice: () => void
}

const PlayerRollDiceView: React.FC<PlayerRollDiceViewProps> = ({
  currentPlayer,
  isCurrentPlayer,
  handleRollingDice,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.diceContainer}>
        <MyText align="center" size="s">
          Model i animacja rzutu kością
        </MyText>
      </View>

      {isCurrentPlayer ? (
        <MyButton onPress={handleRollingDice}>
          <MyText align="center">Przejdź do pytania</MyText>
        </MyButton>
      ) : (
        <MyText align="center" size="s">
          Czekaj na rzut gracza {currentPlayer.playerName}...
        </MyText>
      )}
    </View>
  )
}

export default PlayerRollDiceView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },

  diceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
