import { StyleSheet, View } from 'react-native'
import MyText from './MyText'

type RoundNumberDisplayProps = {
  currentRound: number
  roundsTotal: number
}

const RoundNumberDisplay: React.FC<RoundNumberDisplayProps> = ({
  currentRound,
  roundsTotal,
}) => {
  return (
    <View style={styles.roundsView}>
      <MyText align="center">
        {currentRound && roundsTotal
          ? `Runda: ${currentRound} / ${roundsTotal}`
          : `Runda 0`}
      </MyText>
    </View>
  )
}

export default RoundNumberDisplay

const styles = StyleSheet.create({
  roundsView: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    marginBottom: 6,
  },
})
