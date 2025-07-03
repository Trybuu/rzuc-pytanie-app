import { Question } from '@/store/lobbyStore'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import MyButton from './Button'
import MyText from './MyText'

type PlayerShowAnswerViewProps = {
  playerId: string
  drawnQuestion: Question | null
  questionAnswer: string | null
  isCurrentPlayer: boolean
  markedAnswer: string
  handleNextPlayerTurn: () => void
  handleSetMarkedAnswer: (answer: string) => void
  handleJudgePlayerAnswer: (playerId: string) => void
}

const PlayerShowAnswerView: React.FC<PlayerShowAnswerViewProps> = ({
  playerId,
  drawnQuestion,
  questionAnswer,
  isCurrentPlayer,
  markedAnswer,
  handleNextPlayerTurn,
  handleSetMarkedAnswer,
  handleJudgePlayerAnswer,
}) => {
  const isCorrectAnswer = questionAnswer === markedAnswer
  const shouldShowResult = markedAnswer !== '' && questionAnswer !== null

  // Use effect to trigger judging only once when answer is marked
  useEffect(() => {
    if (isCurrentPlayer && markedAnswer !== '') {
      handleJudgePlayerAnswer(playerId)
    }
  }, [markedAnswer])

  return (
    <View style={styles.container}>
      {shouldShowResult && (
        <View style={styles.answerContainer}>
          {isCorrectAnswer ? (
            <MyText align="center" size="s">
              Świetnie! Poprawna odpowiedź to
            </MyText>
          ) : (
            <MyText align="center" size="s">
              Ale szkoda! Poprawna odpowiedź to
            </MyText>
          )}
          <MyText align="center" size="l" color="orange">
            {questionAnswer}
          </MyText>
        </View>
      )}

      {isCurrentPlayer && shouldShowResult && (
        <MyButton
          onPress={() => {
            handleSetMarkedAnswer('') // Reset on next turn
            handleNextPlayerTurn()
          }}
        >
          <MyText align="center">Kolejna osoba</MyText>
        </MyButton>
      )}
    </View>
  )
}

export default PlayerShowAnswerView

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  answerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
