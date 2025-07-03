import { Player } from '@/store/lobbyStore'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import MyText from './MyText'

type PlayersLeaderboardProps = {
  players: Player[]
  playerId: string
}

const PlayersLeaderboard: React.FC<PlayersLeaderboardProps> = ({
  players,
  playerId,
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points)

  return (
    <View style={styles.scrollViewWrapper}>
      <ScrollView horizontal={true} style={styles.leaderboard}>
        {sortedPlayers.map((p) => (
          <View key={p.id} style={styles.playerElement}>
            <Image
              source={{ uri: p.avatar }}
              style={[
                styles.image,
                p.id === playerId && styles.activePlayerImage,
              ]}
            />
            <MyText
              align="center"
              size="s"
              color={p.id === playerId ? 'purple' : 'white'}
            >
              {p.points} pkt
            </MyText>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

export default PlayersLeaderboard

const styles = StyleSheet.create({
  scrollViewWrapper: {
    height: 96,
  },

  leaderboard: {
    height: 74,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 12,
  },

  playerElement: {
    marginRight: 24,
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 100,
    marginBottom: 6,
  },

  activePlayerImage: {
    borderWidth: 2,
    borderColor: '#A017F4',
  },
})
