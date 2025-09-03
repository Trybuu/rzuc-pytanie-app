import BackButton from '@/components/BackButton'
import MyText from '@/components/MyText'
import Entypo from '@expo/vector-icons/Entypo'
import React, { useState } from 'react'
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from 'react-native'

// Włącz LayoutAnimation na Androidzie (potrzebne)
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const SECTIONS = [
  {
    title: 'Nowa Gra: Zostań Władcą Lobby!',
    content:
      'Chcesz być mózgiem operacji i poprowadzić swoich znajomych do sławy (lub spektakularnej porażki)? Z menu głównego wybierz Nowa Gra. W mgnieniu oka staniesz się zarządcą lobby! Twoja misja? Zaproś swoich ziomków, udostępniając im supertajny kod pokoju, który znajdziesz w prawym górnym rogu ekranu. Pamiętaj, maksymalnie 8 szalonych głów może dołączyć do tej przygody! Gdy wszyscy już będą na pokładzie, ustalcie liczbę rund (nie przesadzajcie, chyba że macie całą noc!), wybierzcie kategorie pytań i – co najważniejsze – rozpocznij rozgrywkę! Nie ma co czekać, imperium pytań czeka!',
  },
  {
    title: 'Dołącz do Gry: Witajcie na Pokładzie!',
    content:
      'Jesteś zaproszonym gościem, gotowym na wyzwanie? Po prostu wpisz kod pokoju, który dostałeś od swojego gospodarza. Następnie dodaj swoje zdjęcie (niech inni wiedzą, z kim mają do czynienia – uśmiech mile widziany!) i wpisz swoje imię (żadne tam Gracz123, pokażcie klasę!). Teraz pozostaje Ci tylko jedno – cierpliwie poczekać, aż Władca Lobby wreszcie ogarnie się i rozpocznie grę. Może w międzyczasie poćwicz jakieś riposty? Przyda się!',
  },
  {
    title: 'Ilość Rund: Maraton pytań czy szybki sprint?',
    content:
      'Ta liczba to klucz do waszego zmęczenia (czy też zadowolenia!). Określa, ile pytań z KAŻDEJ wybranej kategorii zostanie wylosowanych dla graczy. Prosty przykład: jeśli wybierzecie 3 kategorie i ustawicie 2 rundy, to każdy z Was dostanie 6 pytań – po 2 z każdej kategorii. Maksymalnie możecie zagrać aż 6 rund, więc jeśli macie dużo czasu i jeszcze więcej kawy, to jazda!',
  },
  {
    title: 'Kategorie Pytań: Wiedza ogólna kontra sekrety współgraczy!',
    content:
      'Pytania Wbudowane: To nasza skarbnica wiedzy! Mamy tu pytania na każdy temat, od fizyki kwantowej po... no dobra, może nie aż tak, ale na pewno coś ciekawego się znajdzie! Niektóre z nich są punktowane, więc przygotujcie swoje mózgownice, bo punkty lecą! Pytania Własne: Ach, kategoria dla prawdziwych intrygantów! Tutaj możecie zadać anonimowe pytanie wylosowanemu graczowi. Czy zapytasz o najbardziej kompromitującą sytuację z dzieciństwa? A może o to, co twój przyjaciel robił wczoraj o 3 nad ranem? Te pytania nie są punktowane, ale za to mają określoną trudność – bo czasem najtrudniejsze jest odpowiedzieć szczerze!',
  },
  {
    title: 'Punktacja: Kości prawdę Ci powiedzą!',
    content:
      'Punkty? Jasne, że są! Trudność pytania decyduje o tym, ile punktów możesz zgarnąć. Trudność jest sprytnie obrazowana przez... liczbę oczek na wirtualnej kości! Od 1 do 6. Czyli tak: 1 oczko to łatwizna (takie pytanie rozgrzewkowe na dzień dobry). 6 oczek to już hardkor (pytanie, które może sprawić, że zaczniecie podejrzewać, że wiecie mniej, niż myśleliście!).',
  },
]

export default function HowToPlay() {
  const [activeSection, setActiveSection] = useState<number | null>(null)

  const handleExpandSection = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setActiveSection((prev) => (prev === index ? null : index))
  }

  return (
    <ScrollView style={styles.viewWrapper}>
      <BackButton />

      <View>
        <MyText size="xl" color="yellow">
          Instrukcje dla Arcymistrzów Imprez i Wiedzy Tajemnej!
        </MyText>

        <MyText>
          Gotowi na wyzwanie, które rozgrzeje każdą imprezę i sprawdzi Waszą
          wiedzę (a czasem też... poziom zaufania do znajomych)? Rzuć Pytanie to
          towarzyska gra, która zamieni zwykłe spotkanie w epicką bitwę na
          pytania! Przygotujcie się na wirtualne kości, niespodzianki z bazy
          pytań i (uwaga!) anonimowe zaczepki od współgraczy. Idealna na
          wieczory, gdy macie ochotę na coś więcej niż tylko small talk!
        </MyText>
      </View>

      <View style={styles.sectionsWrapper}>
        {SECTIONS.map(({ title, content }, index) => (
          <Pressable
            onPress={() => handleExpandSection(index)}
            key={title}
            style={styles.sectionContainer}
          >
            <View style={styles.sectionContent}>
              <MyText flexWrap={true}>{title}</MyText>
              {index === activeSection ? (
                <Entypo
                  name="chevron-with-circle-up"
                  size={24}
                  color="#FDD988"
                />
              ) : (
                <Entypo
                  name="chevron-with-circle-down"
                  size={24}
                  color="#FDD988"
                />
              )}
            </View>

            {index === activeSection && (
              <View style={{ marginTop: 12 }}>
                <MyText>{content}</MyText>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      <View>
        <MyText>
          Gotowi na emocje? Pamiętajcie, najważniejsza jest dobra zabawa i
          (czasem) lekkie podpuszczanie znajomych! Kto dziś będzie królem pytań,
          a kto zaliczy spektakularną wpadkę? Czas pokaże!
        </MyText>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  viewWrapper: {
    flexGrow: 1,
    paddingVertical: 54,
    paddingHorizontal: 24,
  },

  sectionsWrapper: {
    marginVertical: 24,
  },

  sectionContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FDD988',
    borderRadius: 24,
    padding: 12,
  },

  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
})
