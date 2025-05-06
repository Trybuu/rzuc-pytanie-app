import MyText from '@/components/MyText'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function HowToPlay() {
  return (
    <ScrollView style={styles.viewWrapper}>
      <View style={styles.viewContent}>
        <MyText bold>Ogólny zarys gry</MyText>
        <MyText>
          Rzuć pytanie - gra towarzyska do wspólnej zabawy w jednym
          pomieszczeniu. Gracze rzucają wirtualną kością, odpowiadają na pytania
          znajdujące się w bazie pytań gry lub na te zadane przez innego gracza.
          Gra opiera się na sprawdzaniu wiedzy, zaufaniu i dobrej zabawie –
          idealna na imprezy, spotkania i wieczory z przyjaciółmi.
        </MyText>
      </View>

      <View style={styles.viewContent}>
        <MyText bold>Tworzenie gry</MyText>
        <MyText>
          Jeden z graczy tworzy pokój, do którego dołączają później inni gracze.
          Wybiera swoje zdjęcie, imię, kategorie pytań, ilość rund oraz
          rozpoczyna rozgrywkę.
        </MyText>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    backgroundColor: '#2B2F41',
    padding: 24,
  },

  viewContent: {
    marginBottom: 12,
  },
})
