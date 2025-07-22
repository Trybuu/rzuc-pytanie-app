import socket from '@/client/socket'
import { useLobbyStore } from '@/store/lobbyStore'
import { Image, StyleSheet, View } from 'react-native'
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
  const topPlayers = players.sort((a, b) => b.points - a.points).slice(0, 3)

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
  const randomVictoryPhrase = topPlayers[0]
    ? topPlayers[0].playerName[topPlayers[0].playerName.length - 1] === 'a'
      ? victoryPhrasesFemale[
          Math.floor(Math.random() * victoryPhrasesFemale.length)
        ]
      : victoryPhrasesMale[
          Math.floor(Math.random() * victoryPhrasesMale.length)
        ]
    : 'pozamiatał'

  return (
    <View style={styles.container}>
      <View style={styles.winnerInfoWrapper}>
        <MyText>{randomHeading}</MyText>
        <MyText>
          {topPlayers[0] ? topPlayers[0].playerName : 'Gracz'}{' '}
          {randomVictoryPhrase}
        </MyText>
      </View>

      <View style={styles.podiumWrapper}>
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
      </View>

      {isPlayerHost ? (
        <MyButton bgColor="purple" onPress={() => handlePlayAgain()}>
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
    boxShadow: '0 0 100px 1px #EDCC71',
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
