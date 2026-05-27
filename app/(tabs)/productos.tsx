/**
 * Pantalla de productos — lista con búsqueda + modal crear/editar.
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
  ScrollView,
} from "react-native";
import {
  useProducts,
  useCreateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { IProduct } from "@/types";
import { Colors } from "@/constants/colors";
import { PageHeader } from "@/components/common/PageHeader";
import { Icon } from "@/components/ui/Icon";
import { Screen } from "@/components/common/Screen";

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: "cube-outline" | "alert-circle-outline" | "pricetag-outline";
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

function ProductCard({
  product,
  onEdit,
  onDelete,
}: {
  product: IProduct;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isLowStock = product.stock <= product.min_stock;
  return (
    <View style={styles.card}>
      <View style={styles.productAvatar}>
        <Icon name="cube-outline" size={18} color={Colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardName}>{product.name}</Text>
          {isLowStock && (
            <View style={styles.lowBadge}>
              <Text style={styles.lowBadgeText}>Stock bajo</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardCategory}>{product.category}</Text>
        <Text style={styles.cardMeta}>
          Stock: {product.stock} · Mín: {product.min_stock}
        </Text>
      </View>
      <View style={styles.cardActionsWrap}>
        <Text style={styles.cardPrice}>S/ {product.price.toFixed(2)}</Text>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={onEdit} style={styles.editBtn}>
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Icon name="trash-outline" size={14} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ProductosScreen() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    cost: "",
    stock: "",
    min_stock: "5",
    category: "general",
  });

  const { data: products = [], isLoading } = useProducts();
  const { mutateAsync: createProduct, isPending } = useCreateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );
  const lowStockCount = products.filter((p) => p.stock <= p.min_stock).length;

  const handleCreate = async () => {
    if (!form.name || !form.price) {
      Alert.alert("Error", "Nombre y precio son obligatorios");
      return;
    }
    try {
      await createProduct({
        name: form.name,
        price: parseFloat(form.price),
        cost: form.cost ? parseFloat(form.cost) : 0,
        stock: form.stock ? parseInt(form.stock) : 0,
        min_stock: parseInt(form.min_stock) || 5,
        category: form.category || "general",
      });
      setShowModal(false);
      setForm({
        name: "",
        price: "",
        cost: "",
        stock: "",
        min_stock: "5",
        category: "general",
      });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleDelete = (p: IProduct) => {
    Alert.alert("Eliminar", `¿Eliminar "${p.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteProduct(p.id),
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.contentWrap}>
        <PageHeader
          title="Productos"
          subtitle="Organiza tu inventario"
          icon="cube-outline"
          actionLabel="Agregar"
          actionIcon="add"
          onActionPress={() => setShowModal(true)}
        />

        <View style={styles.summaryGrid}>
          <SummaryCard
            label="Total"
            value={String(products.length)}
            icon="cube-outline"
          />
          <SummaryCard
            label="Stock bajo"
            value={String(lowStockCount)}
            icon="alert-circle-outline"
          />
          <SummaryCard
            label="Filtrados"
            value={String(filtered.length)}
            icon="pricetag-outline"
          />
        </View>

        <View style={styles.mainPanel}>
          <View style={styles.searchWrap}>
            <Icon name="search-outline" size={18} color={Colors.gray500} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar producto..."
              placeholderTextColor={Colors.gray500}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onEdit={() =>
                  Alert.alert("Próximamente", "Edición disponible pronto")
                }
                onDelete={() => handleDelete(item)}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Icon name="cube-outline" size={24} color={Colors.info} />
                </View>
                <Text style={styles.emptyText}>
                  {isLoading ? "Cargando..." : "Mantén tu inventario al día"}
                </Text>
                {!isLoading && (
                  <Text style={styles.emptySubtext}>
                    Agrega fichas tus productos para verlos aquí
                  </Text>
                )}
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nuevo producto</Text>
            <ScrollView
              style={{ maxHeight: 420 }}
              contentContainerStyle={{ gap: 10 }}
            >
              {[
                { key: "name", placeholder: "Nombre *", keyboard: "default" },
                {
                  key: "price",
                  placeholder: "Precio de venta (S/) *",
                  keyboard: "decimal-pad",
                },
                {
                  key: "cost",
                  placeholder: "Costo de compra (S/)",
                  keyboard: "decimal-pad",
                },
                {
                  key: "stock",
                  placeholder: "Stock inicial",
                  keyboard: "number-pad",
                },
                {
                  key: "min_stock",
                  placeholder: "Stock mínimo (alerta)",
                  keyboard: "number-pad",
                },
                {
                  key: "category",
                  placeholder: "Categoría (ej: bebidas)",
                  keyboard: "default",
                },
              ].map(({ key, placeholder, keyboard }) => (
                <TextInput
                  key={key}
                  style={styles.input}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.gray500}
                  value={(form as any)[key]}
                  onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
                  keyboardType={keyboard as any}
                />
              ))}
            </ScrollView>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
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
    gap: 14,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FAFBFA",
    borderWidth: 1,
    borderColor: "#E9EEEA",
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
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
  productAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary50,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  cardName: { fontSize: 15, fontWeight: "600", color: Colors.text },
  cardCategory: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
    textTransform: "capitalize",
  },
  cardMeta: { fontSize: 12, color: Colors.textMuted, marginTop: 6 },
  cardPrice: { fontSize: 16, fontWeight: "700", color: Colors.primary },
  cardActionsWrap: { alignItems: "flex-end", gap: 10 },
  cardActions: { flexDirection: "row", gap: 8 },
  lowBadge: {
    backgroundColor: "#FEF3C7",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  lowBadgeText: { fontSize: 11, color: "#92400E", fontWeight: "600" },
  editBtn: {
    backgroundColor: Colors.gray100,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editBtnText: { fontSize: 12, color: Colors.text, fontWeight: "500" },
  deleteBtn: {
    backgroundColor: "#FEE2E2",
    borderRadius: 10,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#CAD5FF",
    backgroundColor: "#F7F9FF",
    padding: 36,
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#E7F0FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyText: { fontSize: 16, fontWeight: "600", color: Colors.text },
  emptySubtext: { fontSize: 13, color: Colors.textMuted, textAlign: "center" },
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
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  saveBtnText: { color: Colors.white, fontWeight: "600" },
});
