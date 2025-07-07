import { StyleSheet, View } from 'react-native'
import MyText from './MyText'

type AccessCodeViewProps = {
  accessCode: string
}

const AccessCodeView: React.FC<AccessCodeViewProps> = ({ accessCode }) => {
  const accessCodeArray = accessCode.split('')

  return (
    <View style={styles.accessCodeWrapper}>
      {accessCodeArray.map((digitTxt, index) => (
        <View style={styles.accessCodeTile} key={index}>
          <MyText align="center">{digitTxt}</MyText>
        </View>
      ))}
    </View>
  )
}

export default AccessCodeView

const styles = StyleSheet.create({
  accessCodeWrapper: {
    flexDirection: 'row',
  },

  accessCodeTile: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 36,
    marginLeft: 6,
    // boxShadow: 'inset 2px 2px 2px rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
  },
})
