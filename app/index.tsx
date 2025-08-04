import ButtonLink from '@/components/ButtonLink'
import Logo from '@/components/Logo'
import MyText from '@/components/MyText'
import { StyleSheet, View } from 'react-native'

export default function Index() {
  return (
    <View style={styles.viewWrapper}>
      <Logo width={250} height={250} />
      <View style={[styles.viewContent, styles.viewDesc]}>
        <MyText align="center">
          Witaj w grze “Rzuć pytanie”, gdzie kostka decyduje, a reszta zależy od
          twojej wiedzy i odwagi - zaproś znajomych i przygotujcie się na
          świetną zabawę!
        </MyText>
      </View>
      <View style={styles.viewContent}>
        <ButtonLink href="/menu" withSoundEffect>
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
    paddingVertical: 54,
    paddingHorizontal: 24,
    backgroundColor: 'transparent',
  },

  viewContent: {},

  viewLogo: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewDesc: {
    flexGrow: 1,
  },
})
