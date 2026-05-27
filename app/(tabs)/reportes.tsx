/**
 * Pantalla de IA — análisis y recomendaciones del negocio.
 */

import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useAIAnalysis } from "@/hooks/useAI";
import { IAIRequest } from "@/types";
import { Colors } from "@/constants/colors";
import { Screen } from "@/components/common/Screen";
import { Icon, IconName } from "@/components/ui/Icon";

const ANALYSIS_TYPES: {
  type: IAIRequest["type"];
  label: string;
  icon: IconName;
}[] = [
  { type: "general", label: "Análisis general", icon: "analytics-outline" },
  { type: "top_products", label: "Productos estrella", icon: "star-outline" },
  { type: "restock", label: "Reabastecer", icon: "bag-add-outline" },
  { type: "profit", label: "Ganancias", icon: "card-outline" },
  { type: "debts", label: "Fiados", icon: "wallet-outline" },
  {
    type: "slow_products",
    label: "Productos lentos",
    icon: "trending-down-outline",
  },
];

const ANALYSIS_DESCRIPTIONS: Record<IAIRequest["type"], string> = {
  general:
    "Vista general del rendimiento del negocio y recomendaciones accionables.",
  top_products:
    "Descubre qué productos destacan y cuáles conviene seguir impulsando.",
  restock: "Identifica qué productos necesitan reabastecimiento pronto.",
  profit: "Analiza ingresos, costos y oportunidades para mejorar margen.",
  debts: "Revisa clientes con fiado y patrones de pago pendientes.",
  slow_products: "Detecta productos con baja rotación para tomar decisiones.",
};

export default function ReportesScreen() {
  const [selectedType, setSelectedType] =
    useState<IAIRequest["type"]>("general");
  const [question, setQuestion] = useState("");
  const { mutateAsync: analyze, isPending, data, reset } = useAIAnalysis();

  const handleAnalyze = async () => {
    await analyze({
      type: selectedType,
      question: question.trim() || undefined,
      days: 30,
    });
  };

  return (
    <Screen scrollable>
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Asistente IA</Text>
        <Text style={styles.subtitle}>Análisis inteligente de tu bodega</Text>
      </View>

      <View style={styles.dashboardGrid}>
        <View style={styles.leftColumn}>
          <View style={styles.previewCard}>
            <View style={styles.previewTopBar}>
              <View style={styles.previewChipActive}>
                <Icon
                  name="sparkles-outline"
                  size={12}
                  color={Colors.primary}
                />
                <Text style={styles.previewChipActiveText}>Asistente IA</Text>
              </View>
              <View style={styles.previewTopIcons}>
                <View style={styles.previewDot} />
                <View style={styles.previewDot} />
                <View style={styles.previewDot} />
              </View>
            </View>

            <View style={styles.previewWindow}>
              <View style={styles.previewNav}>
                {["Inicio", "Ventas", "Stock", "Caja", "IA Asistente"].map(
                  (item, index) => (
                    <Text
                      key={item}
                      style={[
                        styles.previewNavText,
                        index === 4 && styles.previewNavTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  ),
                )}
              </View>

              <View style={styles.assistantProfileCard}>
                <View style={styles.avatarWrap}>
                  <View style={styles.avatarOuter}>
                    <View style={styles.avatarInner}>
                      <Icon name="sparkles" size={36} color={Colors.primary} />
                    </View>
                  </View>
                </View>
                <Text style={styles.assistantName}>Bodega AI</Text>
                <Text style={styles.assistantRole}>
                  Asistente virtual para ventas, inventario y fiados
                </Text>
                <View style={styles.assistantStatusRow}>
                  <View style={styles.assistantStatusChip}>
                    <View style={styles.assistantStatusDot} />
                    <Text style={styles.assistantStatusText}>En línea</Text>
                  </View>
                  <View style={styles.assistantStatusChipMuted}>
                    <Text style={styles.assistantStatusMutedText}>
                      Disponible 24/7
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.previewOverlayInfo}>
              <View style={styles.syncBadge}>
                <Text style={styles.syncBadgeText}>Sincronizado</Text>
              </View>
              <Text style={styles.previewOverlayTitle}>
                Datos en tiempo real
              </Text>
              <Text style={styles.previewOverlaySubtitle}>
                Analiza ventas, inventario y fiados con recomendaciones
                automáticas.
              </Text>
            </View>
          </View>

          <View style={styles.statusCard}>
            <View style={styles.statusIconWrap}>
              <Icon name="analytics-outline" size={18} color={Colors.primary} />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Estado del día</Text>
              <Text style={styles.statusText}>
                Tu inventario se encuentra un 12% por encima del promedio
                mensual. IA sugiere revisar "Productos lentos".
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View>
            <Text style={styles.sectionLabel}>¿QUÉ QUIERES ANALIZAR?</Text>
            <View style={styles.typesGrid}>
              {ANALYSIS_TYPES.map(({ type, label, icon }) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeCard,
                    selectedType === type && styles.typeCardActive,
                  ]}
                  onPress={() => {
                    setSelectedType(type);
                    reset();
                  }}
                >
                  <View style={styles.typeIconWrap}>
                    <Icon
                      name={icon}
                      size={18}
                      color={selectedType === type ? Colors.white : "#0F766E"}
                    />
                  </View>
                  <Text
                    style={[
                      styles.typeCardLabel,
                      selectedType === type && styles.typeCardLabelActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.askCard}>
            <Text style={styles.sectionLabel}>O HAZ UNA PREGUNTA LIBRE</Text>

            <View style={styles.questionBox}>
              <TextInput
                style={styles.questionInput}
                placeholder="Ej: ¿Qué producto debería promover este mes?"
                placeholderTextColor={Colors.gray500}
                value={question}
                onChangeText={(value) => {
                  setQuestion(value);
                  reset();
                }}
                multiline
                numberOfLines={4}
              />

              <View style={styles.questionFooter}>
                <Text style={styles.helperText}>
                  {ANALYSIS_DESCRIPTIONS[selectedType]}
                </Text>
                <TouchableOpacity
                  style={[styles.analyzeBtn, isPending && { opacity: 0.7 }]}
                  onPress={handleAnalyze}
                  disabled={isPending}
                >
                  {isPending ? (
                    <ActivityIndicator color={Colors.white} size="small" />
                  ) : (
                    <>
                      <Icon
                        name="sparkles-outline"
                        size={14}
                        color={Colors.white}
                      />
                      <Text style={styles.analyzeBtnText}>Analizar ahora</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {data && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultTitle}>
                    Respuesta del asistente
                  </Text>
                  <Text style={styles.resultSubtitle}>
                    Basado en los últimos {data.days_analyzed} días
                  </Text>
                </View>
                <TouchableOpacity onPress={reset} style={styles.clearBtn}>
                  <Text style={styles.clearText}>Limpiar</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.resultText}>{data.analysis}</Text>

              <View style={styles.dataSummary}>
                <View style={styles.dataSummaryItem}>
                  <Text style={styles.dataSummaryValue}>
                    {data.data_summary.ventas}
                  </Text>
                  <Text style={styles.dataSummaryLabel}>Ventas</Text>
                </View>
                <View style={styles.dataSummaryDivider} />
                <View style={styles.dataSummaryItem}>
                  <Text style={styles.dataSummaryValue}>
                    S/ {data.data_summary.ingresos}
                  </Text>
                  <Text style={styles.dataSummaryLabel}>Ingresos</Text>
                </View>
                <View style={styles.dataSummaryDivider} />
                <View style={styles.dataSummaryItem}>
                  <Text style={styles.dataSummaryValue}>
                    S/ {data.data_summary.ganancia}
                  </Text>
                  <Text style={styles.dataSummaryLabel}>Ganancia</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageHeader: { gap: 4, marginBottom: 4 },
  title: { fontSize: 32, fontWeight: "700", color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textMuted },
  dashboardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    alignItems: "flex-start",
  },
  leftColumn: { flexGrow: 1, flexBasis: 320, gap: 14 },
  rightColumn: { flexGrow: 1, flexBasis: 520, gap: 16 },
  previewCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D6E4DA",
    overflow: "hidden",
    minHeight: 360,
  },
  previewTopBar: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F7FBF8",
    borderBottomWidth: 1,
    borderBottomColor: "#E4EEE8",
  },
  previewChipActive: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary50,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  previewChipActiveText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.primary,
  },
  previewTopIcons: { flexDirection: "row", gap: 6 },
  previewDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: "#B9C7BE",
  },
  previewWindow: { padding: 14, gap: 12, backgroundColor: "#FBFDFC" },
  previewNav: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  previewNavText: { fontSize: 10, color: "#6B7C73" },
  previewNavTextActive: { color: Colors.primary, fontWeight: "700" },
  assistantProfileCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8E4",
    backgroundColor: Colors.white,
    padding: 18,
    alignItems: "center",
    gap: 10,
  },
  avatarWrap: { marginTop: 2, marginBottom: 2 },
  avatarOuter: {
    width: 92,
    height: 92,
    borderRadius: 999,
    backgroundColor: "#EAF8EF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D7F0DE",
  },
  avatarInner: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  assistantName: { fontSize: 18, fontWeight: "700", color: Colors.text },
  assistantRole: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 240,
  },
  assistantStatusRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 2,
  },
  assistantStatusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#ECFDF5",
  },
  assistantStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#10B981",
  },
  assistantStatusText: { fontSize: 11, fontWeight: "600", color: "#047857" },
  assistantStatusChipMuted: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  assistantStatusMutedText: {
    fontSize: 11,
    fontWeight: "500",
    color: Colors.textMuted,
  },
  previewOverlayInfo: {
    marginTop: "auto",
    padding: 16,
    minHeight: 160,
    justifyContent: "flex-end",
    backgroundColor: "#A3A3A3",
  },
  syncBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  syncBadgeText: { color: Colors.white, fontSize: 10, fontWeight: "600" },
  previewOverlayTitle: { fontSize: 24, fontWeight: "700", color: Colors.white },
  previewOverlaySubtitle: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255,255,255,0.88)",
    maxWidth: 260,
  },
  statusCard: {
    backgroundColor: "#F3FBF6",
    borderWidth: 1,
    borderColor: "#CFE9D7",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  statusIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#DDF5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  statusContent: { flex: 1, gap: 4 },
  statusTitle: { fontSize: 20, fontWeight: "700", color: Colors.text },
  statusText: { fontSize: 13, lineHeight: 19, color: Colors.textMuted },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
    letterSpacing: 0.4,
    marginBottom: 10,
  },
  typesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  typeCard: {
    flexGrow: 1,
    flexBasis: 150,
    minHeight: 92,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#D8E1DC",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 10,
  },
  typeCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  typeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  typeCardLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text,
    textAlign: "center",
  },
  typeCardLabelActive: { color: Colors.white },
  askCard: {
    backgroundColor: "#EAF2FF",
    borderWidth: 1,
    borderColor: "#D6E4FF",
    borderRadius: 16,
    padding: 14,
  },
  questionBox: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#CFD9E8",
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    justifyContent: "space-between",
    gap: 12,
  },
  questionInput: {
    fontSize: 15,
    color: Colors.text,
    minHeight: 64,
    textAlignVertical: "top",
  },
  questionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  helperText: {
    flex: 1,
    minWidth: 220,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.textMuted,
  },
  analyzeBtn: {
    backgroundColor: "#10B981",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  analyzeBtnText: { color: Colors.white, fontSize: 13, fontWeight: "600" },
  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D8E1DC",
    gap: 14,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    flexWrap: "wrap",
  },
  resultTitle: { fontSize: 16, fontWeight: "700", color: Colors.text },
  resultSubtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  clearBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearText: { fontSize: 13, color: Colors.textMuted, fontWeight: "500" },
  resultText: { fontSize: 15, color: Colors.text, lineHeight: 24 },
  dataSummary: {
    flexDirection: "row",
    alignItems: "stretch",
    flexWrap: "wrap",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
  },
  dataSummaryItem: { flexGrow: 1, minWidth: 140, padding: 14, gap: 4 },
  dataSummaryDivider: { width: 1, backgroundColor: "#E5E7EB" },
  dataSummaryValue: { fontSize: 16, fontWeight: "700", color: Colors.text },
  dataSummaryLabel: { fontSize: 12, color: Colors.textMuted },
});
