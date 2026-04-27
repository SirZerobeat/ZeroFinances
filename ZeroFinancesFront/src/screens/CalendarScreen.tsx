import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../store/transactionStore';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../utils/colors';
import { TransactionItem } from '../components/TransactionItem';

export function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { transacciones } = useTransactionStore();
  const theme = useThemeStore((state) => state.theme);
  const colors = getThemeColors(theme);

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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Text style={[styles.navButton, { color: colors.primary }]}>← Anterior</Text>
        </TouchableOpacity>
        <Text style={[styles.monthName, { color: colors.text }]}>{monthName}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={[styles.navButton, { color: colors.primary }]}>Siguiente →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarGrid}>
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((day) => (
          <Text key={day} style={[styles.weekDay, { color: colors.textSecondary }]}>
            {day}
          </Text>
        ))}

        {Array(firstDay)
          .fill(null)
          .map((_, i) => (
            <View key={`empty-${i}`} style={[styles.emptyDay, { backgroundColor: theme === 'dark' ? colors.surface : '#fafafa' }]} />
          ))}

        {days.map((day) => {
          const dayTransacciones = getTransactionesForDay(day);
          const hasTransacciones = dayTransacciones.length > 0;

          return (
            <View
              key={day}
              style={[
                styles.dayCell,
                { borderColor: colors.border },
                hasTransacciones && { backgroundColor: theme === 'dark' ? colors.surface : '#f0f8ff' }
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  { color: colors.text },
                  hasTransacciones && { color: colors.primary }
                ]}
              >
                {day}
              </Text>
              {hasTransacciones && (
                <View style={[styles.transactionIndicator, { backgroundColor: colors.primary }]}>
                  <Text style={styles.indicatorText}>{dayTransacciones.length}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={[styles.transactionsList, { borderTopColor: colors.border }]}>
        <Text style={[styles.transactionsTitle, { color: colors.text }]}>Transacciones del mes</Text>
        {transacciones.length === 0 ? (
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>No hay transacciones</Text>
        ) : (
          transacciones.map((t) => (
            <TransactionItem key={t.id} transaccion={t} />
          ))
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  monthName: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  navButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 12,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyDay: {
    width: '14.28%',
    aspectRatio: 1,
  },
  transactionIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
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
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  transactionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginVertical: 20,
  },
});
