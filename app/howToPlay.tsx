import BackButton from '@/components/BackButton'
import MyText from '@/components/MyText'
import { useHeaderHeight } from '@react-navigation/elements'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function HowToPlay() {
  const headerHeight = useHeaderHeight()

  return (
    <ScrollView style={styles.viewWrapper}>
      <BackButton />

      <View style={[styles.viewContent, { paddingTop: headerHeight }]}>
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
    flexGrow: 1,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },

  viewContent: {
    marginBottom: 12,
    padding: 24,
  },
})
