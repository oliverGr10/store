/**
 * Pantalla de venta — busca productos, agrega al carrito, cobra (contado o fiado).
 */

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale } from "@/hooks/useSales";
import { useCartStore } from "@/store/cartStore";
import { Colors } from "@/constants/colors";
import { router } from "expo-router";
import { Screen } from "@/components/common/Screen";
import { PageHeader } from "@/components/common/PageHeader";
import { Icon } from "@/components/ui/Icon";

export default function VenderScreen() {
  const [search, setSearch] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [customerName, setCustomerName] = useState("");

  const { data: products = [] } = useProducts();
  const { mutateAsync: createSale, isPending } = useCreateSale();
  const { items, addItem, updateQuantity, clear, total, itemCount } =
    useCartStore();

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0,
  );

  const handleCobrar = async (paymentType: "cash" | "credit") => {
    if (paymentType === "credit" && !customerName.trim()) {
      Alert.alert("Error", "Ingresa el nombre del cliente para el fiado");
      return;
    }

    try {
      await createSale({
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        payment_type: paymentType,
        customer_name: customerName || undefined,
      });
      clear();
      setShowPayment(false);
      setCustomerName("");
      Alert.alert("Venta registrada", `Total: S/ ${total().toFixed(2)}`);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <Screen>
      <View style={styles.contentWrap}>
        <PageHeader
          title="Vender"
          subtitle="Carga tu venta actual"
          icon="cart-outline"
        />

        <View style={styles.columns}>
          <View style={styles.productsColumn}>
            <View style={styles.panelTopRow}>
              <Text style={styles.sectionTitle}>Productos disponibles</Text>
              <View style={styles.searchWrap}>
                <Icon name="search-outline" size={16} color={Colors.gray500} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar producto..."
                  placeholderTextColor={Colors.gray500}
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(p) => p.id}
              renderItem={({ item: p }) => (
                <TouchableOpacity
                  style={styles.productRow}
                  onPress={() => addItem(p)}
                >
                  <View style={styles.productThumb}>
                    <Icon
                      name="cube-outline"
                      size={16}
                      color={Colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productName}>{p.name}</Text>
                    <Text style={styles.productStock}>Stock: {p.stock}</Text>
                  </View>
                  <Text style={styles.productPrice}>
                    S/ {p.price.toFixed(2)}
                  </Text>
                  <View style={styles.addPill}>
                    <Text style={styles.addPillText}>Agregar</Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>Sin productos disponibles</Text>
              }
              contentContainerStyle={{ gap: 10, paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={styles.cart}>
            <View style={styles.cartHeader}>
              <Text style={styles.cartTitle}>Carrito</Text>
              <TouchableOpacity onPress={clear}>
                <Text style={styles.clearInline}>Limpiar</Text>
              </TouchableOpacity>
            </View>

            {items.length > 0 ? (
              <>
                <ScrollView
                  style={{ maxHeight: 260 }}
                  contentContainerStyle={{ gap: 10 }}
                >
                  {items.map((item) => (
                    <View key={item.product.id} style={styles.cartItem}>
                      <Text style={styles.cartItemName} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <View style={styles.cartItemControls}>
                        <TouchableOpacity
                          onPress={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          style={styles.qtyBtn}
                        >
                          <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qty}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          style={styles.qtyBtn}
                        >
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                        <Text style={styles.cartItemPrice}>
                          S/ {(item.product.price * item.quantity).toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.cartFooter}>
                  <Text style={styles.cartTotal}>S/ {total().toFixed(2)}</Text>
                  <TouchableOpacity
                    onPress={() => setShowPayment(true)}
                    style={styles.cobrarBtn}
                  >
                    <Text style={styles.cobrarBtnText}>Cobrar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.emptyCart}>
                <View style={styles.emptyIcon}>
                  <Icon name="basket-outline" size={24} color={Colors.info} />
                </View>
                <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
                <Text style={styles.emptyCartSubtext}>
                  Selecciona productos para agregarlos
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Modal visible={showPayment} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>¿Cómo paga?</Text>
            <Text style={styles.modalTotal}>
              Total: S/ {total().toFixed(2)}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del cliente (opcional)"
              placeholderTextColor={Colors.gray500}
              value={customerName}
              onChangeText={setCustomerName}
            />

            <TouchableOpacity
              style={[styles.payBtn, { backgroundColor: Colors.primary }]}
              onPress={() => handleCobrar("cash")}
              disabled={isPending}
            >
              <Icon name="cash-outline" size={18} color={Colors.white} />
              <Text style={styles.payBtnText}>Contado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.payBtn, { backgroundColor: Colors.secondary }]}
              onPress={() => handleCobrar("credit")}
              disabled={isPending}
            >
              <Icon
                name="document-text-outline"
                size={18}
                color={Colors.white}
              />
              <Text style={styles.payBtnText}>Fiado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowPayment(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
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
  columns: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 16 },
  productsColumn: {
    flexGrow: 1,
    flexBasis: 560,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E5ECE7",
    borderRadius: 18,
    padding: 16,
    minHeight: 420,
    gap: 14,
  },
  panelTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  searchWrap: {
    minWidth: 240,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FAFBFA",
    borderWidth: 1,
    borderColor: "#E9EEEA",
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 42,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderColor: "#E7ECE8",
    borderRadius: 14,
    backgroundColor: "#FCFDFC",
    gap: 10,
  },
  productThumb: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  productName: { fontSize: 14, fontWeight: "600", color: Colors.text },
  productStock: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  productPrice: { fontSize: 14, fontWeight: "700", color: Colors.primary },
  addPill: {
    backgroundColor: "#EAF8EF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  addPillText: { fontSize: 11, color: Colors.primary, fontWeight: "700" },
  empty: { textAlign: "center", padding: 32, color: Colors.textMuted },
  cart: {
    flexGrow: 1,
    flexBasis: 320,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E5ECE7",
    borderRadius: 18,
    padding: 16,
    minHeight: 420,
    gap: 14,
  },
  cartHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartTitle: { fontSize: 14, fontWeight: "700", color: Colors.text },
  clearInline: { fontSize: 12, color: Colors.danger, fontWeight: "600" },
  cartItem: {
    borderWidth: 1,
    borderColor: "#E7ECE8",
    borderRadius: 14,
    padding: 12,
    gap: 10,
    backgroundColor: "#FCFDFC",
  },
  cartItemName: { fontSize: 13, color: Colors.text, fontWeight: "500" },
  cartItemControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 16, fontWeight: "600", color: Colors.text },
  qty: { fontSize: 14, fontWeight: "600", minWidth: 20, textAlign: "center" },
  cartItemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.primary,
    marginLeft: "auto",
  },
  cartFooter: {
    marginTop: "auto",
    gap: 10,
  },
  cartTotal: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text,
    textAlign: "right",
  },
  cobrarBtn: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#BFC5C0",
    alignItems: "center",
  },
  cobrarBtnText: { fontSize: 14, fontWeight: "600", color: Colors.white },
  emptyCart: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 20,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#E7F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyCartText: { fontSize: 16, fontWeight: "600", color: Colors.text },
  emptyCartSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: "center",
  },
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
    gap: 12,
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: Colors.text },
  modalTotal: { fontSize: 16, color: Colors.textMuted },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
  },
  payBtn: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  payBtnText: { color: Colors.white, fontSize: 16, fontWeight: "600" },
  cancelBtn: { alignItems: "center", padding: 12 },
  cancelBtnText: { color: Colors.textMuted, fontSize: 15 },
});
