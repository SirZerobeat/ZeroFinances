import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Transaccion } from '../store/transactionStore';

interface TransactionItemProps {
  transaccion: Transaccion;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaccion }) => {
  const isIngreso = transaccion.tipo === 'ingreso';
  const signo = isIngreso ? '+' : '-';
  const color = isIngreso ? '#4CAF50' : '#ff3333';

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.comercio}>{transaccion.comercio}</Text>
        <Text style={styles.categoria}>{transaccion.categoria}</Text>
        {transaccion.descripcion && (
          <Text style={styles.descripcion}>{transaccion.descripcion}</Text>
        )}
      </View>
      <View style={styles.rightContent}>
        <Text style={[styles.monto, { color }]}>
          {signo}${transaccion.monto.toFixed(2)}
        </Text>
        <Text style={styles.fecha}>
          {transaccion.fecha.toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftContent: {
    flex: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  comercio: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  categoria: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  descripcion: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  monto: {
    fontSize: 14,
    fontWeight: '700',
  },
  fecha: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
});
