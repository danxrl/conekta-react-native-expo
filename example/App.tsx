import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createToken, TokenData } from 'conekta-react-native-expo';

const initialCard = {
  name: 'Juan Perez',
  number: '4242424242424242',
  cvc: '123',
  expMonth: '01',
  expYear: '28',
};

export default function App() {
  const [card, setCard] = useState(initialCard);
  const [status, setStatus] = useState<string>('');
  const [token, setToken] = useState<TokenData | null>(null);

  const handleCreateToken = async () => {
    setStatus('Solicitando token…');
    setToken(null);
    try {
      const result = await createToken(card);
      setToken(result);
      setStatus('Token generado correctamente.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      setStatus(`Fallo al generar token: ${message}`);
    }
  };

  const updateCard = (field: keyof typeof card) => (value: string) => {
    setCard((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Conekta tokenización</Text>

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Datos de la tarjeta</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={card.name}
            onChangeText={updateCard('name')}
          />
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={card.number}
            onChangeText={updateCard('number')}
            keyboardType="number-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="CVC"
            value={card.cvc}
            onChangeText={updateCard('cvc')}
            keyboardType="number-pad"
          />
          <View style={styles.inline}>
            <TextInput
              style={[styles.input, styles.inlineInput]}
              placeholder="Mes (MM)"
              value={card.expMonth}
              onChangeText={updateCard('expMonth')}
              keyboardType="number-pad"
              maxLength={2}
            />
            <TextInput
              style={[styles.input, styles.inlineInput]}
              placeholder="Año (YY)"
              value={card.expYear}
              onChangeText={updateCard('expYear')}
              keyboardType="number-pad"
              maxLength={2}
            />
          </View>
        </View>

        <Button title="Generar token" onPress={handleCreateToken} />

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Resultado</Text>
          <Text style={styles.status}>{status}</Text>
          {token && (
            <View style={styles.tokenBox}>
              <Text style={styles.tokenLine}>ID: {token.id}</Text>
              <Text style={styles.tokenLine}>Objeto: {String(token.object)}</Text>
              <Text style={styles.tokenLine}>Modo live: {String(token.livemode)}</Text>
              <Text style={styles.tokenLine}>Usado: {String(token.used)}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f5',
  },
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  group: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4d4d8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inline: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineInput: {
    flex: 1,
  },
  status: {
    fontSize: 14,
    color: '#52525b',
  },
  tokenBox: {
    borderWidth: 1,
    borderColor: '#e4e4e7',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8fafc',
    gap: 4,
  },
  tokenLine: {
    fontSize: 14,
    color: '#27272a',
  },
});
