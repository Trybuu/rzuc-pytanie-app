import socket from '@/client/socket'
import { useLobbyStore } from '@/store/lobbyStore'
import { Audio } from 'expo-av'
import { useEffect } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import MyButton from './Button'
import MyText from './MyText'

type GameOverViewProps = {
  hostId: string
  handlePlayAgain: () => void
}

const GameOverView: React.FC<GameOverViewProps> = ({
  hostId,
  handlePlayAgain,
}) => {
  const isPlayerHost = hostId === socket.id
  const { players } = useLobbyStore((state) => state)

  const sortedPlayers = [...players].sort((a, b) => b.points - a.points)
  const topPlayers = sortedPlayers.slice(0, 3)

  const highestScore = sortedPlayers[0]?.points ?? 0
  const winners = sortedPlayers.filter((p) => p.points === highestScore)
  const isDraw = winners.length > 1

  const headings = [
    'Mamy zwycięzcę!',
    'Gratulacje dla zwycięzcy!',
    'Zwycięzca jest tylko jeden!',
    'Mistrz wyłoniony!',
    'Brawa dla najlepszego!',
    'To się nazywa wygrana!',
    'I wszystko jasne - mamy zwycięzcę!',
  ]

  const victoryPhrasesMale = [
    'pozamiatał',
    'zmiażdżył konkurencję',
    'rządzi i dzieli',
    'pokazał klasę',
    'wskoczył na tron',
    'nie dał szans',
    'był nie do zatrzymania',
    'rozgromił wszystkich',
    'zdominował rozgrywkę',
    'zgarnął wszystko',
    'zrobił robotę',
    'udowodnił swoją wartość',
    'zagrał koncertowo',
    'przeszedł samego siebie',
    'pokazał, kto tu rządzi',
    'zostawił wszystkich w tyle',
    'dał popis',
    'zagrał jak mistrz',
    'nikt mu nie dorównał',
    'to był jego moment',
  ]

  const victoryPhrasesFemale = [
    'pozamiatała',
    'zmiażdżyła konkurencję',
    'rządzi i dzieli',
    'pokazała klasę',
    'wskoczyła na tron',
    'nie dała szans',
    'była nie do zatrzymania',
    'rozgromiła wszystkich',
    'zdominowała rozgrywkę',
    'zgarnęła wszystko',
    'zrobiła robotę',
    'udowodniła swoją wartość',
    'zagrała koncertowo',
    'przeszła samą siebie',
    'pokazała, kto tu rządzi',
    'zostawiła wszystkich w tyle',
    'dała popis',
    'zagrała jak mistrzyni',
    'nikt jej nie dorównał',
    'to był jej moment',
  ]

  const randomHeading = headings[Math.floor(Math.random() * headings.length)]
  const randomVictoryPhrase =
    !isDraw && topPlayers[0]
      ? topPlayers[0].playerName[topPlayers[0].playerName.length - 1] === 'a'
        ? victoryPhrasesFemale[
            Math.floor(Math.random() * victoryPhrasesFemale.length)
          ]
        : victoryPhrasesMale[
            Math.floor(Math.random() * victoryPhrasesMale.length)
          ]
      : ''

  useEffect(() => {
    let sound: Audio.Sound | null = null

    const playSound = async () => {
      const soundResult = await Audio.Sound.createAsync(
        require('@/assets/sounds/effects/victory.mp3'),
      )
      sound = soundResult.sound
      await sound.playAsync()
    }

    playSound()

    return () => {
      if (sound) {
        sound.unloadAsync()
      }
    }
  }, [])

  const podiumOpacity = useSharedValue(0)
  const podiumTranslateY = useSharedValue(20)
  const winnerJump = useSharedValue(0)

  useEffect(() => {
    podiumOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    })
    podiumTranslateY.value = withTiming(
      0,
      { duration: 600, easing: Easing.out(Easing.ease) },
      (finished) => {
        if (finished) {
          winnerJump.value = withRepeat(
            withSequence(
              withTiming(-15, {
                duration: 400,
                easing: Easing.inOut(Easing.ease),
              }),
              withTiming(0, {
                duration: 400,
                easing: Easing.inOut(Easing.ease),
              }),
              withTiming(0, { duration: 1200 }),
            ),
            -1,
            false,
          )
        }
      },
    )
  }, [])

  const podiumStyle = useAnimatedStyle(() => ({
    opacity: podiumOpacity.value,
    transform: [{ translateY: podiumTranslateY.value }],
  }))

  const winnerJumpStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: winnerJump.value }],
  }))

  return (
    <View style={styles.container}>
      <View style={styles.winnerInfoWrapper}>
        <MyText>{isDraw ? 'Mamy remis!' : randomHeading}</MyText>
        <MyText>
          {isDraw
            ? `Zwycięzcy: ${winners.map((p) => p.playerName).join(', ')}`
            : `${topPlayers[0]?.playerName ?? 'Gracz'} ${randomVictoryPhrase}`}
        </MyText>
      </View>

      <Animated.View style={[styles.podiumWrapper, podiumStyle]}>
        {topPlayers[1] && (
          <View style={styles.secondPlaceWrapper}>
            <View>
              <Image
                source={{ uri: topPlayers[1].avatar }}
                style={[styles.playerImage, styles.secondPlaceImage]}
              />
              <Image
                source={require('@/assets/images/graphics/silverMedal.png')}
                style={{
                  width: 32,
                  height: 32,
                  position: 'absolute',
                  left: 92 / 2 - 16,
                  bottom: -16,
                }}
              />
            </View>
            <MyText align="center" size="s" color="white">
              {topPlayers[1].playerName}
            </MyText>
          </View>
        )}

        {topPlayers[0] && (
          <View style={styles.firstPlaceWrapper}>
            <Animated.View style={winnerJumpStyle}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: topPlayers[0].avatar }}
                  style={[styles.playerImage, styles.firstPlaceImage]}
                />
                <Image
                  source={require('@/assets/images/graphics/goldMedal.png')}
                  style={{
                    width: 32,
                    height: 32,
                    position: 'absolute',
                    left: 92 / 2 - 16,
                    bottom: -16,
                  }}
                />
              </View>
            </Animated.View>

            <MyText align="center" size="s" color="white">
              {topPlayers[0].playerName}
            </MyText>
          </View>
        )}

        {topPlayers[2] && (
          <View style={styles.thirdPlaceWrapper}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: topPlayers[2].avatar }}
                style={[styles.playerImage, styles.thirdPlaceImage]}
              />
              <Image
                source={require('@/assets/images/graphics/brownMedal.png')}
                style={{
                  width: 32,
                  height: 32,
                  position: 'absolute',
                  left: 92 / 2 - 16,
                  bottom: -16,
                }}
              />
            </View>
            <MyText align="center" size="s" color="white">
              {topPlayers[2].playerName}
            </MyText>
          </View>
        )}
      </Animated.View>

      {isPlayerHost ? (
        <MyButton bgColor="purple" onPress={handlePlayAgain}>
          <MyText align="center">Gramy ponownie!</MyText>
        </MyButton>
      ) : (
        <MyText align="center" size="s" color="white">
          Czekaj na rozpoczęcie nowej gry lub opuść lobby
        </MyText>
      )}
    </View>
  )
}

export default GameOverView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  winnerInfoWrapper: {
    alignItems: 'center',
  },
  podiumWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  imageWrapper: {
    position: 'relative',
  },
  playerImage: {
    width: 92,
    height: 92,
    borderRadius: 92,
    borderWidth: 4,
  },
  firstPlaceImage: {
    borderColor: '#EDCC71',
  },
  secondPlaceImage: {
    borderColor: '#C1C2C5',
  },
  thirdPlaceImage: {
    borderColor: '#E9A44E',
  },
  firstPlaceWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '33%',
    minHeight: 150,
    padding: 12,
  },
  secondPlaceWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '33%',
    minHeight: 150,
    marginTop: 48,
  },
  thirdPlaceWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '33%',
    minHeight: 150,
    marginTop: 48,
  },
})
