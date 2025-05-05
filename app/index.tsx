import ButtonLink from '@/components/ButtonLink'
import MyText from '@/components/MyText'
import { StyleSheet, View } from 'react-native'

export default function Index() {
  return (
    <View style={styles.viewWrapper}>
      <View style={[styles.viewContent, styles.viewLogo]}>
        <MyText>Rzuć pytanie</MyText>
      </View>
      <View style={[styles.viewContent, styles.viewDesc]}>
        <MyText align="center">
          Witaj w grze “Rzuć pytanie”, gdzie kostka decyduje, a reszta zależy od
          twojej wiedzy i odwagi - zaproś znajomych i przygotujcie się na
          świetną zabawę!
        </MyText>
      </View>
      <View style={styles.viewContent}>
        <ButtonLink href="/menu">
          <MyText align="center">Rozpocznij</MyText>
        </ButtonLink>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#2B2F41',
    padding: 24,
  },

  viewContent: {
    marginVertical: 12,
  },

  viewLogo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewDesc: {
    flexGrow: 1,
  },
})
