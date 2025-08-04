import socket from '@/client/socket'
import { Player } from '@/store/lobbyStore'
import FastImage from 'expo-fast-image'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import MyButton from './Button'
import MyText from './MyText'

// Animowany komponent View
const AnimatedView = Animated.createAnimatedComponent(View)

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

  // Animacje dla całego kontenera
  const containerTranslateY = useSharedValue(100)
  const containerOpacity = useSharedValue(0)

  useEffect(() => {
    // Reset animacji
    containerTranslateY.value = 100
    containerOpacity.value = 0

    // Animacja wjazdu i fade-in
    containerTranslateY.value = withTiming(0, { duration: 600 })
    containerOpacity.value = withTiming(1, { duration: 800 })
  }, [playerTurnIndex])

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: containerTranslateY.value }],
    opacity: containerOpacity.value,
  }))

  if (!currentPlayer) {
    return (
      <View style={styles.container}>
        <MyText align="center" color="gray">
          Ładowanie gracza...
        </MyText>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <AnimatedView style={[styles.currentPlayerContainer, containerStyle]}>
        <FastImage
          source={{ uri: players[playerTurnIndex]?.avatar }}
          style={styles.image}
        />

        <MyText align="center" size="m">
          Odpowiada {currentPlayer.playerName}
        </MyText>
      </AnimatedView>

      {isCurrentPlayer ? (
        <MyButton onPress={handlePlayerTurnReady} bgColor="purple">
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
    width: 230,
    height: 230,
    borderRadius: 115,
    marginBottom: 12,
    alignSelf: 'center',
  },
})
