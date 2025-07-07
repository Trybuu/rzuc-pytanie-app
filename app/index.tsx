import BackgroundWrapper from '@/components/BackgroundWrapper'
import ButtonLink from '@/components/ButtonLink'
import MyText from '@/components/MyText'
import { Image, StyleSheet, View } from 'react-native'

export default function Index() {
  return (
    <BackgroundWrapper>
      <View style={styles.viewWrapper}>
        <View style={[styles.viewContent, styles.viewLogo]}>
          <Image
            source={require('../assets/images/graphics/logo.png')}
            style={{ width: 250, height: 250 }}
            resizeMode="contain"
          ></Image>
        </View>
        <View style={[styles.viewContent, styles.viewDesc]}>
          <MyText align="center">
            Witaj w grze “Rzuć pytanie”, gdzie kostka decyduje, a reszta zależy
            od twojej wiedzy i odwagi - zaproś znajomych i przygotujcie się na
            świetną zabawę!
          </MyText>
        </View>
        <View style={styles.viewContent}>
          <ButtonLink href="/menu">
            <MyText align="center">Rozpocznij</MyText>
          </ButtonLink>
        </View>
      </View>
    </BackgroundWrapper>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingVertical: 48,
    paddingHorizontal: 24,
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
