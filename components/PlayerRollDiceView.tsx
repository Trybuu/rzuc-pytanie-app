import { Player } from '@/store/lobbyStore'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import MyButton from './Button'
import DiceToRoll from './DiceToRoll'
import MyText from './MyText'

type PlayerRollDiceViewProps = {
  isCurrentPlayer: boolean
  currentPlayer: Player
  lastDiceRoll: number
  handleRollingDice: () => void
  handleShowQuestion: () => void
}

const PlayerRollDiceView: React.FC<PlayerRollDiceViewProps> = ({
  currentPlayer,
  isCurrentPlayer,
  lastDiceRoll,
  handleRollingDice,
  handleShowQuestion,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const onRollDicePress = () => {
    setIsButtonDisabled(true)
    handleRollingDice()
  }

  // const [isGestureDisabled, setIsGestureDisabled] = useState(false)
  // const onSwipeUp = () => {
  //   // setIsGestureDisabled(true)
  //   handleRollingDice()
  // }

  // const swipeUpGesture = Gesture.Pan().onEnd((e) => {
  //   if (e.translationY < -50) {
  //     onSwipeUp()
  //   }
  // })

  return (
    <View style={styles.container}>
      <DiceToRoll diceFace={lastDiceRoll} />

      {isCurrentPlayer ? (
        lastDiceRoll === 0 ? (
          <MyButton onPress={onRollDicePress} disabled={isButtonDisabled}>
            <MyText align="center">Rzuć kością</MyText>
          </MyButton>
        ) : (
          <MyButton onPress={handleShowQuestion}>
            <MyText align="center">Przejdź do pytania</MyText>
          </MyButton>
        )
      ) : (
        <MyText align="center" size="s">
          Czekaj na rzut gracza {currentPlayer.playerName}...
        </MyText>
      )}

      {/* {isCurrentPlayer ? (
        lastDiceRoll === 0 ? (
          <Animated.View style={styles.swipeZone}>
            <MyText align="center">Przesuń w górę, aby rzucić kością</MyText>
          </Animated.View>
        ) : (
          <MyButton onPress={handleShowQuestion}>
            <MyText align="center">Przejdź do pytania</MyText>
          </MyButton>
        )
      ) : (
        <MyText align="center" size="s">
          Czekaj na rzut gracza {currentPlayer.playerName}...
        </MyText>
      )} */}
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

  // swipeZone: {
  //   height: 200,
  //   width: 100,
  //   backgroundColor: 'rgba(0, 0, 0, 0.1)',
  // },
})
