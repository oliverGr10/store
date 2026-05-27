/**
 * Dashboard — ventas del día, ganancia y alertas de stock bajo.
 */

import { View, Text, RefreshControl, StyleSheet } from "react-native";
import { useSalesToday } from "@/hooks/useSales";
import { useProducts } from "@/hooks/useProducts";
import { useAuthStore } from "@/store/authStore";
import { Colors } from "@/constants/colors";
import { Screen } from "@/components/common/Screen";
import { Icon } from "@/components/ui/Icon";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon:
    | "receipt-outline"
    | "cash-outline"
    | "trending-up-outline"
    | "cube-outline";
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconWrap}>
        <Icon name={icon} size={16} color={Colors.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { data: today, isLoading, refetch } = useSalesToday();
  const { data: products } = useProducts();
  const user = useAuthStore((s) => s.user);

  const lowStock = products?.filter((p) => p.stock <= p.min_stock) ?? [];
  const firstName = user?.email?.split("@")[0] ?? "bodeguero";

  return (
    <Screen
      scrollable
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View style={styles.contentWrap}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Hola, {firstName}</Text>
            <Text style={styles.subtitle}>Resumen de hoy</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Ventas hoy"
            value={String(today?.sales_count ?? 0)}
            icon="receipt-outline"
          />
          <StatCard
            label="Ingresos"
            value={`S/ ${today?.total_revenue?.toFixed(2) ?? "0.00"}`}
            icon="cash-outline"
          />
          <StatCard
            label="Ganancia"
            value={`S/ ${today?.total_profit?.toFixed(2) ?? "0.00"}`}
            icon="trending-up-outline"
          />
          <StatCard
            label="Productos"
            value={String(products?.length ?? 0)}
            icon="cube-outline"
          />
        </View>

        {!isLoading && (today?.sales_count ?? 0) === 0 ? (
          <View style={styles.heroEmptyCard}>
            <View style={styles.heroEmptyIcon}>
              <Icon name="cart-outline" size={26} color={Colors.primary} />
            </View>
            <Text style={styles.heroEmptyTitle}>Aún no hay ventas hoy</Text>
            <Text style={styles.heroEmptySubtext}>
              Ve a la pestaña "Vender" para registrar una y comenzar a
              visualizar tus ganancias.
            </Text>
            <View style={styles.heroActionPill}>
              <Icon
                name="arrow-forward-outline"
                size={14}
                color={Colors.white}
              />
              <Text style={styles.heroActionText}>Ir a vender</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.bottomGrid}>
          <View style={styles.activityCard}>
            <Text style={styles.sectionTitle}>Actividad reciente</Text>
            <View style={styles.activityItem}>
              <View style={styles.activityIconWrap}>
                <Icon name="receipt-outline" size={15} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>Resumen actualizado</Text>
                <Text style={styles.activityText}>
                  Tus métricas del día están sincronizadas.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.sectionTitle}>Tip de IA</Text>
            <Text style={styles.tipText}>
              {lowStock.length > 0
                ? `Hay ${lowStock.length} producto(s) con stock bajo. Revisa inventario para evitar quiebres.`
                : "Tu nivel de stock se ve estable. Mantén seguimiento diario para vender mejor."}
            </Text>
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contentWrap: {
    width: "100%",
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "700", color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginTop: 2 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    flexGrow: 1,
    flexBasis: 220,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5ECE7",
    gap: 8,
  },
  statIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 22, fontWeight: "700", color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textMuted },
  heroEmptyCard: {
    minHeight: 220,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5ECE7",
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
    gap: 10,
  },
  heroEmptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 999,
    backgroundColor: "#E7F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroEmptyTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  heroEmptySubtext: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textMuted,
    textAlign: "center",
    maxWidth: 420,
  },
  heroActionPill: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroActionText: { color: Colors.white, fontSize: 12, fontWeight: "600" },
  bottomGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  activityCard: {
    flexGrow: 1,
    flexBasis: 360,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5ECE7",
    padding: 16,
    gap: 12,
  },
  tipCard: {
    flexGrow: 1,
    flexBasis: 280,
    backgroundColor: "#F4FBF6",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8EBDC",
    padding: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
    letterSpacing: 0.4,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FAFBFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2EF",
    padding: 12,
  },
  activityIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: { fontSize: 13, fontWeight: "600", color: Colors.text },
  activityText: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
  tipText: { fontSize: 13, lineHeight: 20, color: Colors.textMuted },
});
