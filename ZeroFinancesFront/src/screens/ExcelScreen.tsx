import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTransactionStore } from '../store/transactionStore';
import { useThemeStore } from '../store/themeStore';
import { getThemeColors } from '../utils/colors';
import { Button } from '../components/Button';

export function ExcelScreen() {
  const { transacciones } = useTransactionStore();
  const [isExporting, setIsExporting] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const colors = getThemeColors(theme);

  const calculateTotals = () => {
    const ingresos = transacciones
      .filter((t) => t.tipo === 'ingreso')
      .reduce((sum, t) => sum + t.monto, 0);

    const egresos = transacciones
      .filter((t) => t.tipo === 'egreso')
      .reduce((sum, t) => sum + t.monto, 0);

    return {
      ingresos,
      egresos,
      neto: ingresos - egresos,
    };
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      // TODO: Integrar con librería de generación de Excel
      // Por ejemplo: xlsx, react-native-excel-library, etc.

      Alert.alert(
        'Exportar Excel',
        'La funcionalidad de exportación a Excel se integrará con la API del backend',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar a Excel');
    } finally {
      setIsExporting(false);
    }
  };

  const totals = calculateTotals();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={{ flex: 1 }}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Generar Reportes</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Exporta tus transacciones a Excel
          </Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Ingresos</Text>
            <Text style={[styles.summaryValue, styles.ingresoText]}>
              +${totals.ingresos.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Egresos</Text>
            <Text style={[styles.summaryValue, styles.egresoText]}>
              -${totals.egresos.toFixed(2)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Neto</Text>
            <Text style={[
              styles.summaryValue,
              totals.neto >= 0 ? styles.ingresoText : styles.egresoText
            ]}>
              {totals.neto >= 0 ? '+' : '-'}${Math.abs(totals.neto).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Opciones de Exportación</Text>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
            disabled={transacciones.length === 0}
          >
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Todas las transacciones</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                {transacciones.length} registros encontrados
              </Text>
            </View>
            <Text style={[styles.optionIcon, { color: colors.primary }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
            disabled={transacciones.length === 0}
          >
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Últimos 30 días</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                {transacciones.filter((t) => {
                  const date = new Date(t.fecha);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return date >= thirtyDaysAgo;
                }).length} registros
              </Text>
            </View>
            <Text style={[styles.optionIcon, { color: colors.primary }]}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
            disabled={transacciones.length === 0}
          >
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: colors.text }]}>Resumen por categoría</Text>
              <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                Agrupa por tipo y categoría
              </Text>
            </View>
            <Text style={[styles.optionIcon, { color: colors.primary }]}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <Button
            title={isExporting ? 'Exportando...' : 'Descargar Excel'}
            onPress={handleExportExcel}
            loading={isExporting}
            disabled={isExporting || transacciones.length === 0}
          />
          {transacciones.length === 0 && (
            <Text style={styles.emptyMessage}>
              No hay transacciones para exportar
            </Text>
          )}
        </View>

        <View style={[styles.infoSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Información</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Los archivos Excel se generarán con formato estándar compatible con Microsoft Excel y LibreOffice. Incluyen todos los detalles de tus transacciones.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
  },
  summaryCard: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  summaryItem: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  divider: {
    width: 1,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  ingresoText: {
    color: '#4CAF50',
  },
  egresoText: {
    color: '#ff3333',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  optionIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  actionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
