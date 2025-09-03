import { Question } from '@/store/lobbyStore'
import { useEffect } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import MyButton from './Button'
import MyText from './MyText'

const dieImages = [
  require('@/assets/images/regular_dies/die1.png'),
  require('@/assets/images/regular_dies/die2.png'),
  require('@/assets/images/regular_dies/die3.png'),
  require('@/assets/images/regular_dies/die4.png'),
  require('@/assets/images/regular_dies/die5.png'),
  require('@/assets/images/regular_dies/die6.png'),
]

const AnimatedView = Animated.createAnimatedComponent(View)

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
  // Animacje
  const diceOpacity = useSharedValue(0)
  const diceTranslateY = useSharedValue(20)

  const answersOpacity = useSharedValue(0)
  const answersTranslateY = useSharedValue(20)

  useEffect(() => {
    // Animacja wyjazdu kostka + pytania
    diceOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    })
    diceTranslateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    })

    // Po animacji kostki, animujemy odpowiedzi z opóźnieniem 600ms
    answersOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) }),
    )
    answersTranslateY.value = withDelay(
      600,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) }),
    )
  }, [lastDiceRoll, drawnQuestion])

  const diceStyle = useAnimatedStyle(() => ({
    opacity: diceOpacity.value,
    transform: [{ translateY: diceTranslateY.value }],
  }))

  const answersStyle = useAnimatedStyle(() => ({
    opacity: answersOpacity.value,
    transform: [{ translateY: answersTranslateY.value }],
  }))

  const onCheckAnswer = () => {
    if (questionAnswer && markedAnswer !== '') {
      handleShowAnswer()
    }
  }

  const renderDiceAndQuestion = () => (
    <AnimatedView style={[styles.questionWrapper, diceStyle]}>
      {lastDiceRoll ? (
        <Image
          source={dieImages[lastDiceRoll - 1]}
          style={{ width: 32, height: 32, marginBottom: 12 }}
        />
      ) : null}
      <MyText align="center" size="m">
        {drawnQuestion ? drawnQuestion.question : 'Brak pytania'}
      </MyText>
    </AnimatedView>
  )

  const renderAnswers = () => (
    <AnimatedView style={[styles.answers, answersStyle]}>
      {drawnQuestion ? (
        drawnQuestion.answers.map((answer) => (
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
        ))
      ) : (
        <MyText size="s" align="center">
          Brak odpowiedzi
        </MyText>
      )}
    </AnimatedView>
  )

  const renderActionButtons = () => {
    if (!isCurrentPlayer) return null

    return questionAnswer ? (
      <MyButton onPress={onCheckAnswer}>
        <MyText align="center">Sprawdź odpowiedź</MyText>
      </MyButton>
    ) : (
      <MyButton onPress={handleNextPlayerTurn}>
        <MyText align="center">Kolejna osoba</MyText>
      </MyButton>
    )
  }

  if (!lastDiceRoll || !drawnQuestion) return <View style={styles.container} />

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={styles.flex}
        >
          {renderDiceAndQuestion()}
          {questionAnswer && renderAnswers()}
        </ScrollView>

        <View style={styles.actionButtonsContainer}>
          {renderActionButtons()}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default PlayerAnswerView

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  content: {
    flexGrow: 1,
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
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginVertical: 6,
    borderColor: 'rgba(50,50,50,0.2)',
    borderBottomWidth: 1,
    borderBottomColor: '#FDD988',
  },

  actionButtonsContainer: {
    paddingVertical: 6,
  },
})
