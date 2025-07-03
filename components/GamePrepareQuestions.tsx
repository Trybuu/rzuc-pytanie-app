import socket from '@/client/socket'
import MyButton from '@/components/Button'
import MyText from '@/components/MyText'
import { Player } from '@/store/lobbyStore'
import { useState } from 'react'
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import BackgroundWrapper from './BackgroundWrapper'

type GamePrepareQuestionsProps = {
  players: Player[]
  accessCode: string
  playerId: string
}

const GamePrepareQuestions: React.FC<GamePrepareQuestionsProps> = ({
  players,
  accessCode,
  playerId,
}) => {
  const dieImages = [
    require('@/assets/images/regular_dies/die1.png'),
    require('@/assets/images/regular_dies/die2.png'),
    require('@/assets/images/regular_dies/die3.png'),
    require('@/assets/images/regular_dies/die4.png'),
    require('@/assets/images/regular_dies/die5.png'),
    require('@/assets/images/regular_dies/die6.png'),
  ]
  const inputIds = ['input1', 'input2', 'input3', 'input4', 'input5', 'input6']
  const [inputValues, setInputValues] = useState<string[]>(
    Array(inputIds.length).fill(''),
  )

  const player = players?.find((p) => p.id === playerId)
  const questionsTargetId = players?.find(
    (p) => p.id === playerId,
  )?.questionsTargetPlayerId
  const questionTargetPlayer = players?.find((p) => p.id === questionsTargetId)
  const playersReadyCount = players?.filter((p) => p.isReady).length

  const handleChangeInputValue = (value: string, index: number) => {
    setInputValues((prevValues: string[]) => {
      const newValues = [...prevValues]
      newValues[index] = value
      return newValues
    })
  }

  const handleReadyChange = (isReady: boolean) => {
    if (inputValues.some((value) => value.trim() === '')) {
      Alert.alert('Wszystkie pola muszą zostać wypełnione')
      return
    }

    if (isReady) {
      const questions = inputValues.map((value, index) => ({
        id: Math.random().toString(36).substring(2, 15),
        question: value.trim(),
        is_custom: true,
        category_id: 0,
        answers: null,
        answer: null,
        points: null,
        isAnswered: false,
        difficulty: index + 1,
      }))

      socket.emit(
        'prepareQuestions',
        { accessCode, playerId, questions },
        (response: { success: boolean }) => {
          if (response.success) {
            // Dopiero teraz ustaw gotowość
            socket.emit(
              'readyChange',
              { accessCode, playerId, isReady },
              (readyResponse: { success: boolean; message: string }) => {
                if (!readyResponse.success) {
                  console.error('Błąd zmiany gotowości:', readyResponse.message)
                }
              },
            )
          } else {
            console.error('Błąd podczas ustawiania pytań')
          }
        },
      )
    } else {
      // Jeśli cofamy gotowość
      socket.emit('readyChange', { accessCode, playerId, isReady }, () => {})
    }
  }

  return (
    <BackgroundWrapper>
      <ScrollView style={styles.viewWrapper}>
        <View>
          <MyText align="center" size="l">
            Dodaj własne pytania
          </MyText>
          <View>
            <MyText align="center">Zadajesz pytania graczowi</MyText>
            <MyText align="center" color="orange">
              {questionTargetPlayer?.playerName}
            </MyText>
          </View>
          <MyText align="center" size="s" color="gray">
            Im więcej oczek tym pytanie powinno być trudniejsze. Pytania te są
            anonimowe. Pytania mogą być najróżniejsze, od sprawdzenia wiedzy z
            różnych kategorii aż po sferę prywatną. Daj upust swojej wyobraźni!
          </MyText>
        </View>

        <View>
          {inputIds.map((input, index) => (
            <View key={input}>
              <MyText align="left" size="s" color="gray">
                Pytanie {index + 1}
              </MyText>
              <View style={styles.inputWrapper}>
                <Image
                  source={dieImages[index]}
                  style={{ width: 24, height: 24 }}
                />
                <TextInput
                  style={styles.textInput}
                  value={inputValues[index]}
                  onChange={(e) =>
                    handleChangeInputValue(e.nativeEvent.text, index)
                  }
                ></TextInput>
              </View>
            </View>
          ))}
        </View>

        <MyButton
          bgColor={player?.isReady ? 'green' : 'red'}
          onPress={() => handleReadyChange(!player?.isReady)}
        >
          <MyText align="center">
            {player?.isReady ? 'Gotów' : 'Niegotowy'}
          </MyText>
        </MyButton>

        <MyText align="center" size="s" color="gray">
          {player?.isReady
            ? 'Jesteś gotowy, czekaj na rozpoczęcie gry'
            : 'Aktualnie jesteś niegotowy'}
        </MyText>
        <MyText align="center" size="s" color="gray">
          {playersReadyCount} / {players.length} graczy gotowych
        </MyText>
      </ScrollView>
    </BackgroundWrapper>
  )
}

export default GamePrepareQuestions

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 2,
    borderColor: '#FDD988',
    borderRadius: 24,
  },

  textInput: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'MuseoModerno',
  },
})
