/**
 * Pantalla de fiados — lista de deudas pendientes y marcar como pagado.
 */

import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useDebts, useCreateDebt, usePayDebt } from "@/hooks/useDebts";
import { IDebt } from "@/types";
import { Colors } from "@/constants/colors";
import { PageHeader } from "@/components/common/PageHeader";
import { Screen } from "@/components/common/Screen";
import { Icon } from "@/components/ui/Icon";

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "cash-outline" | "people-outline" | "wallet-outline";
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryIconWrap}>
        <Icon name={icon} size={16} color={Colors.primary} />
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

function DebtCard({ debt, onPay }: { debt: IDebt; onPay: () => void }) {
  const date = new Date(debt.created_at).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
  });
  return (
    <View style={styles.card}>
      <View style={styles.debtAvatar}>
        <Icon name="person-outline" size={18} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardName}>{debt.customer_name}</Text>
        {debt.note && <Text style={styles.cardNote}>{debt.note}</Text>}
        <Text style={styles.cardDate}>{date}</Text>
      </View>
      <View style={{ alignItems: "flex-end", gap: 10 }}>
        <Text style={styles.cardAmount}>
          S/ {Number(debt.amount).toFixed(2)}
        </Text>
        <TouchableOpacity onPress={onPay} style={styles.payBtn}>
          <Icon
            name="checkmark-circle-outline"
            size={16}
            color={Colors.white}
          />
          <Text style={styles.payBtnText}>Pagó</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function FiadosScreen() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customer_name: "", amount: "", note: "" });

  const { data: debts = [] } = useDebts(false);
  const { mutateAsync: createDebt, isPending } = useCreateDebt();
  const { mutateAsync: payDebt } = usePayDebt();

  const totalPendiente = debts.reduce((sum, d) => sum + Number(d.amount), 0);

  const handlePay = (debt: IDebt) => {
    Alert.alert(
      "Marcar como pagado",
      `¿${debt.customer_name} pagó S/ ${Number(debt.amount).toFixed(2)}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, pagó", onPress: () => payDebt(debt.id) },
      ],
    );
  };

  const handleCreate = async () => {
    if (!form.customer_name || !form.amount) {
      Alert.alert("Error", "Nombre y monto son obligatorios");
      return;
    }
    try {
      await createDebt({
        customer_name: form.customer_name,
        amount: parseFloat(form.amount),
        note: form.note || undefined,
      });
      setShowModal(false);
      setForm({ customer_name: "", amount: "", note: "" });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <Screen>
      <View style={styles.contentWrap}>
        <PageHeader
          title="Fiados"
          subtitle="Administra tus pagos pendientes"
          icon="wallet-outline"
          actionLabel="Agregar"
          actionIcon="add"
          onActionPress={() => setShowModal(true)}
        />

        <View style={styles.summaryGrid}>
          <SummaryCard
            label="Total pendiente"
            value={`S/ ${totalPendiente.toFixed(2)}`}
            icon="cash-outline"
          />
          <SummaryCard
            label="Clientes"
            value={String(debts.length)}
            icon="people-outline"
          />
          <SummaryCard
            label="Fiados"
            value={String(debts.length)}
            icon="wallet-outline"
          />
        </View>

        <View style={styles.mainPanel}>
          <FlatList
            data={debts}
            keyExtractor={(d) => d.id}
            renderItem={({ item }) => (
              <DebtCard debt={item} onPay={() => handlePay(item)} />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Icon
                    name="checkmark-done-outline"
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.emptyText}>Sin fiados pendientes</Text>
                <Text style={styles.emptySubtext}>
                  Todos tus clientes están al día
                </Text>
                <View style={styles.emptyActions}>
                  <TouchableOpacity style={styles.emptySecondaryBtn}>
                    <Text style={styles.emptySecondaryText}>Ver historial</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.emptyPrimaryBtn}
                    onPress={() => setShowModal(true)}
                  >
                    <Text style={styles.emptyPrimaryText}>Registrar nuevo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo fiado</Text>
            <View style={{ gap: 10 }}>
              <TextInput
                style={styles.input}
                placeholder="Nombre del cliente *"
                placeholderTextColor={Colors.gray500}
                value={form.customer_name}
                onChangeText={(v) =>
                  setForm((f) => ({ ...f, customer_name: v }))
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Monto (S/) *"
                placeholderTextColor={Colors.gray500}
                value={form.amount}
                onChangeText={(v) => setForm((f) => ({ ...f, amount: v }))}
                keyboardType="decimal-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Nota (ej: 2 cervezas del martes)"
                placeholderTextColor={Colors.gray500}
                value={form.note}
                onChangeText={(v) => setForm((f) => ({ ...f, note: v }))}
              />
            </View>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                style={[styles.saveBtn, isPending && { opacity: 0.6 }]}
                disabled={isPending}
              >
                <Text style={styles.saveBtnText}>
                  {isPending ? "Guardando..." : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contentWrap: {
    flex: 1,
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
    gap: 16,
  },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  summaryCard: {
    flexGrow: 1,
    flexBasis: 180,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5ECE7",
    padding: 16,
    gap: 8,
  },
  summaryIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryValue: { fontSize: 22, fontWeight: "700", color: Colors.text },
  summaryLabel: { fontSize: 12, color: Colors.textMuted },
  mainPanel: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5ECE7",
    padding: 16,
  },
  listContent: { gap: 12, paddingBottom: 24 },
  card: {
    backgroundColor: "#FCFDFC",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E7ECE8",
    gap: 14,
    alignItems: "center",
  },
  debtAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  cardName: { fontSize: 15, fontWeight: "600", color: Colors.text },
  cardNote: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  cardDate: { fontSize: 12, color: Colors.textMuted, marginTop: 6 },
  cardAmount: { fontSize: 18, fontWeight: "700", color: Colors.secondary },
  payBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  payBtnText: { color: Colors.white, fontSize: 13, fontWeight: "600" },
  emptyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E7ECE8",
    backgroundColor: "#FEFEFE",
    padding: 36,
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 999,
    backgroundColor: "#DDF5E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyText: { fontSize: 18, fontWeight: "700", color: Colors.text },
  emptySubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
    maxWidth: 360,
  },
  emptyActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptySecondaryBtn: {
    backgroundColor: "#EEF2FF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  emptySecondaryText: { fontSize: 12, color: Colors.info, fontWeight: "600" },
  emptyPrimaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  emptyPrimaryText: { fontSize: 12, color: Colors.white, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  cancelBtnText: { color: Colors.textMuted, fontWeight: "500" },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.secondary,
    alignItems: "center",
  },
  saveBtnText: { color: Colors.white, fontWeight: "600" },
});
