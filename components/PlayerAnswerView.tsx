import { Question } from '@/store/lobbyStore'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import MyButton from './Button'
import MyText from './MyText'

type PlayerAnswerViewProps = {
  lastDiceRoll: number | undefined
  drawnQuestion: Question | null
  questionAnswer: string | null
  isCurrentPlayer: boolean
  markedAnswer: string
  handleNextPlayerTurn: () => void
  handleShowAnswer: () => void
  handleSetMarkedAnswer: (answer: string) => void
}

const dieImages = [
  require('@/assets/images/regular_dies/die1.png'),
  require('@/assets/images/regular_dies/die2.png'),
  require('@/assets/images/regular_dies/die3.png'),
  require('@/assets/images/regular_dies/die4.png'),
  require('@/assets/images/regular_dies/die5.png'),
  require('@/assets/images/regular_dies/die6.png'),
]

const PlayerAnswerView: React.FC<PlayerAnswerViewProps> = ({
  lastDiceRoll,
  drawnQuestion,
  questionAnswer,
  markedAnswer,
  isCurrentPlayer,
  handleNextPlayerTurn,
  handleShowAnswer,
  handleSetMarkedAnswer,
}) => {
  if (!lastDiceRoll || !drawnQuestion) return <View style={styles.container} />

  const renderDiceAndQuestion = () => (
    <View style={styles.questionWrapper}>
      <Image
        source={dieImages[lastDiceRoll - 1]}
        style={{ width: 32, height: 32, marginBottom: 12 }}
      />
      <MyText align="center" size="m">
        {drawnQuestion.question}
      </MyText>
    </View>
  )

  const renderAnswers = () => (
    <View style={styles.answers}>
      {drawnQuestion.answers.map((answer) => (
        <Pressable
          key={answer}
          style={styles.answerButton}
          onPress={() => handleSetMarkedAnswer(answer)}
        >
          <MyText
            size="s"
            align="center"
            color={answer === markedAnswer ? 'orange' : 'white'}
          >
            {answer}
          </MyText>
        </Pressable>
      ))}
    </View>
  )

  const renderActionButtons = () => {
    if (!isCurrentPlayer) return null

    return questionAnswer ? (
      <MyButton onPress={handleShowAnswer}>
        <MyText align="center">Sprawdź odpowiedź</MyText>
      </MyButton>
    ) : (
      <MyButton onPress={handleNextPlayerTurn}>
        <MyText align="center">Kolejna osoba</MyText>
      </MyButton>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {renderDiceAndQuestion()}
      {questionAnswer && renderAnswers()}
      <View style={styles.actionButtonsContainer}>{renderActionButtons()}</View>
    </ScrollView>
  )
}

export default PlayerAnswerView

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  questionWrapper: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },

  answers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  answerButton: {
    width: '100%',
    padding: 10,
    marginVertical: 6,
    // borderRadius: 6,
    borderColor: 'rgba(50,50,50,0.2)',
    borderBottomWidth: 1,
    borderBottomColor: '#FDD988',
    // boxShadow: '0 0 10px 3px rgb(189, 6, 180)',
  },

  actionButtonsContainer: {
    paddingVertical: 12,
  },
})
