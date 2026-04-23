import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTransactionStore } from '../store/transactionStore';
import { TransactionItem } from '../components/TransactionItem';

export function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { transacciones } = useTransactionStore();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = selectedMonth.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePreviousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  };

  const getTransactionesForDay = (day: number) => {
    return transacciones.filter((t) => {
      const date = new Date(t.fecha);
      return (
        date.getDate() === day &&
        date.getMonth() === selectedMonth.getMonth() &&
        date.getFullYear() === selectedMonth.getFullYear()
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Text style={styles.navButton}>← Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.monthName}>{monthName}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navButton}>Siguiente →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarGrid}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}

        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <View key={`empty-${i}`} style={styles.emptyDay} />
          ))}

        {days.map((day) => {
          const dayTransacciones = getTransactionesForDay(day);
          const hasTransacciones = dayTransacciones.length > 0;

          return (
            <View
              key={day}
              style={[
                styles.dayCell,
                hasTransacciones && styles.dayWithTransacciones
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  hasTransacciones && styles.dayNumberWithTransacciones
                ]}
              >
                {day}
              </Text>
              {hasTransacciones && (
                <View style={styles.transactionIndicator}>
                  <Text style={styles.indicatorText}>{dayTransacciones.length}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.transactionsList}>
        <Text style={styles.transactionsTitle}>Transacciones del mes</Text>
        {transacciones.length === 0 ? (
          <Text style={styles.emptyMessage}>No hay transacciones</Text>
        ) : (
          transacciones.map((t) => (
            <TransactionItem key={t.id} transaccion={t} />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textTransform: 'capitalize',
  },
  navButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  calendarGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
    fontSize: 12,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayWithTransacciones: {
    backgroundColor: '#f0f8ff',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dayNumberWithTransacciones: {
    color: '#007AFF',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
    backgroundColor: '#fafafa',
  },
  transactionIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  transactionsList: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
});
