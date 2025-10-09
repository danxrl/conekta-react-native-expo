import { useCallback, useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet } from 'react-native';
import { createCardToken } from 'conekta-react-native-expo';

export default function App() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [result, setResult] = useState('');

  const createCard = useCallback(async () => {
    const result = await createCardToken({
      publicKey: '',
      name,
      number,
      expMonth,
      expYear,
      cvc,
    });
    setResult(result.id);
  }, [name, number, expYear, expYear, cvc])

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(newText: string) => setName(newText)}
        value={name}
        placeholder={'Nombre'}
      />
      <TextInput
        onChangeText={(newText: string) => setNumber(newText)}
        value={number}
        placeholder={'4242424242424242'}
      />
      <TextInput
        onChangeText={(newText: string) => setExpMonth(newText)}
        value={expMonth}
        placeholder={'MM'}
      />
      <TextInput
        onChangeText={(newText: string) => setExpYear(newText)}
        value={expYear}
        placeholder={'YY'}
      />
      <TextInput
        onChangeText={(newText: string) => setCvc(newText)}
        value={cvc}
        placeholder={'CVC'}
      />
      <Button
        title="Guardar tarjeta"
        onPress={createCard}
      />
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
