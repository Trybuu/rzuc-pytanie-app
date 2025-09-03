import ButtonLink from '@/components/ButtonLink'
import Logo from '@/components/Logo'
import MyText from '@/components/MyText'
import { ScrollView, StyleSheet, View } from 'react-native'

type Route = '/newGame' | '/joinGame' | '/howToPlay' | '/questionCategories'

export default function Menu() {
  const menuItems: { href: Route; label: string }[] = [
    { href: '/newGame', label: 'Nowa Gra' },
    { href: '/joinGame', label: 'Dołącz do gry' },
    { href: '/howToPlay', label: 'Jak grać' },
    { href: '/questionCategories', label: 'Kategorie pytań' },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Logo width={100} height={100} />
      </View>

      <ScrollView contentContainerStyle={styles.linksWrapper}>
        {menuItems.map(({ href, label }) => (
          <ButtonLink href={href} key={href}>
            <MyText align="center">{label}</MyText>
          </ButtonLink>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    flex: 1,
  },
  logoWrapper: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(160, 23, 244, 0.5)',
    marginHorizontal: 24,
  },
  linksWrapper: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
})
