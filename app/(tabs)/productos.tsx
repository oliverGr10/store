/**
 * Pantalla de productos — lista con búsqueda + modal crear.
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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  useProducts,
  useCreateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { IProduct } from "@/types";
import { Colors } from "@/constants/colors";
import { PageHeader } from "@/components/common/PageHeader";
import { Icon, IconName } from "@/components/ui/Icon";
import { Screen } from "@/components/common/Screen";

// ─── Tarjeta de resumen ──────────────────────────────────────────────────────

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

// ─── Campo de formulario con label + descripción + ícono ────────────────────

function FormField({
  label,
  hint,
  icon,
  required,
  value,
  placeholder,
  keyboard,
  onChange,
  optional,
}: {
  label: string;
  hint: string;
  icon: IconName;
  required?: boolean;
  optional?: boolean;
  value: string;
  placeholder: string;
  keyboard?: "default" | "decimal-pad" | "number-pad";
  onChange: (v: string) => void;
}) {
  return (
    <View style={formStyles.wrap}>
      <View style={formStyles.labelRow}>
        <Text style={formStyles.label}>
          {label}
          {required && <Text style={formStyles.required}> *</Text>}
          {optional && <Text style={formStyles.optional}> (opcional)</Text>}
        </Text>
      </View>
      <Text style={formStyles.hint}>{hint}</Text>
      <View style={formStyles.inputRow}>
        <View style={formStyles.iconWrap}>
          <Icon name={icon} size={16} color={Colors.gray500} />
        </View>
        <TextInput
          style={formStyles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray500}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboard ?? "default"}
        />
      </View>
    </View>
  );
}

// ─── Sección del formulario ─────────────────────────────────────────────────

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={formStyles.section}>
      <Text style={formStyles.sectionTitle}>{title}</Text>
      <View style={formStyles.sectionBody}>{children}</View>
    </View>
  );
}

// ─── Tarjeta de producto ────────────────────────────────────────────────────

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

// ─── Pantalla principal ─────────────────────────────────────────────────────

const CATEGORIES = [
  "general",
  "bebidas",
  "abarrotes",
  "snacks",
  "lácteos",
  "limpieza",
  "otros",
];

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

  const set = (key: string) => (v: string) =>
    setForm((f) => ({ ...f, [key]: v }));

  const resetForm = () =>
    setForm({
      name: "",
      price: "",
      cost: "",
      stock: "",
      min_stock: "5",
      category: "general",
    });

  const handleCreate = async () => {
    if (!form.name.trim()) {
      Alert.alert("Campo requerido", "El nombre del producto es obligatorio");
      return;
    }
    if (!form.price || isNaN(parseFloat(form.price))) {
      Alert.alert("Campo requerido", "Ingresa un precio de venta válido");
      return;
    }
    try {
      await createProduct({
        name: form.name.trim(),
        price: parseFloat(form.price),
        cost: form.cost ? parseFloat(form.cost) : 0,
        stock: form.stock ? parseInt(form.stock) : 0,
        min_stock: parseInt(form.min_stock) || 5,
        category: form.category || "general",
      });
      setShowModal(false);
      resetForm();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const handleDelete = (p: IProduct) => {
    Alert.alert(
      "Eliminar producto",
      `¿Seguro que quieres eliminar "${p.name}"? Esta acción no se puede deshacer.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: () => deleteProduct(p.id),
        },
      ],
    );
  };

  return (
    <Screen>
      <View style={styles.contentWrap}>
        <PageHeader
          title="Productos"
          subtitle="Organiza tu inventario"
          icon="cube-outline"
          actionLabel="+ Agregar"
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
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Icon name="close-circle" size={18} color={Colors.gray500} />
              </TouchableOpacity>
            )}
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
                    Agrega tus productos para empezar a vender
                  </Text>
                )}
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      {/* ─── Modal mejorado ─────────────────────────────────────────── */}
      <Modal
        visible={showModal}
        transparent
        animationType={Platform.OS === "web" ? "fade" : "slide"}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalCard}>
            {/* Header del modal */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalIconWrap}>
                  <Icon name="cube-outline" size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>Nuevo producto</Text>
                  <Text style={styles.modalSubtitle}>
                    Completa los datos de tu producto
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <Icon name="close" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            {/* Cuerpo scrolleable */}
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Sección 1 — Identificación */}
              <FormSection title="Identificación">
                <FormField
                  label="Nombre del producto"
                  hint="Cómo aparecerá en tus ventas y reportes."
                  icon="cube-outline"
                  required
                  value={form.name}
                  placeholder="Ej: Gaseosa Inca Kola 600ml"
                  onChange={set("name")}
                />

                {/* Selector de categoría */}
                <View style={formStyles.wrap}>
                  <Text style={formStyles.label}>Categoría</Text>
                  <Text style={formStyles.hint}>
                    Agrupa tus productos para filtrarlos más fácil.
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.categoryRow}>
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.categoryChip,
                            form.category === cat && styles.categoryChipActive,
                          ]}
                          onPress={() =>
                            setForm((f) => ({ ...f, category: cat }))
                          }
                        >
                          <Text
                            style={[
                              styles.categoryChipText,
                              form.category === cat &&
                                styles.categoryChipTextActive,
                            ]}
                          >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </FormSection>

              {/* Sección 2 — Precios */}
              <FormSection title="Precios">
                <View style={styles.fieldRow}>
                  <View style={{ flex: 1 }}>
                    <FormField
                      label="Precio de venta"
                      hint="Lo que cobras al cliente."
                      icon="cash-outline"
                      required
                      value={form.price}
                      placeholder="0.00"
                      keyboard="decimal-pad"
                      onChange={set("price")}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField
                      label="Costo de compra"
                      hint="Lo que te costó a ti. Sirve para calcular tu ganancia."
                      icon="receipt-outline"
                      optional
                      value={form.cost}
                      placeholder="0.00"
                      keyboard="decimal-pad"
                      onChange={set("cost")}
                    />
                  </View>
                </View>
                {form.price && form.cost ? (
                  <View style={styles.profitPreview}>
                    <Icon
                      name="trending-up-outline"
                      size={14}
                      color={Colors.primary}
                    />
                    <Text style={styles.profitPreviewText}>
                      Ganancia estimada:{" "}
                      <Text style={styles.profitPreviewValue}>
                        S/{" "}
                        {(
                          parseFloat(form.price || "0") -
                          parseFloat(form.cost || "0")
                        ).toFixed(2)}
                      </Text>{" "}
                      por unidad
                    </Text>
                  </View>
                ) : null}
              </FormSection>

              {/* Sección 3 — Inventario */}
              <FormSection title="Inventario">
                <View style={styles.fieldRow}>
                  <View style={{ flex: 1 }}>
                    <FormField
                      label="Stock inicial"
                      hint="Cuántas unidades tienes ahora."
                      icon="layers-outline"
                      optional
                      value={form.stock}
                      placeholder="0"
                      keyboard="number-pad"
                      onChange={set("stock")}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <FormField
                      label="Alerta de stock mínimo"
                      hint="Te avisaremos cuando baje de este número."
                      icon="notifications-outline"
                      optional
                      value={form.min_stock}
                      placeholder="5"
                      keyboard="number-pad"
                      onChange={set("min_stock")}
                    />
                  </View>
                </View>
              </FormSection>
            </ScrollView>

            <View style={styles.modalDivider} />

            {/* Footer con botones */}
            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={handleClose} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                style={[styles.saveBtn, isPending && { opacity: 0.6 }]}
                disabled={isPending}
              >
                {isPending ? (
                  <Text style={styles.saveBtnText}>Guardando...</Text>
                ) : (
                  <>
                    <Icon
                      name="checkmark-circle-outline"
                      size={16}
                      color={Colors.white}
                    />
                    <Text style={styles.saveBtnText}>Guardar producto</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

// ─── Estilos del formulario ────────────────────────────────────────────────

const formStyles = StyleSheet.create({
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  sectionBody: {
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9EEEA",
    padding: 16,
  },
  wrap: { gap: 4 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  label: { fontSize: 13, fontWeight: "600", color: Colors.text },
  required: { color: Colors.danger, fontWeight: "700" },
  optional: { fontSize: 11, color: Colors.textMuted, fontWeight: "400" },
  hint: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E2E8E4",
    borderRadius: 12,
    backgroundColor: "#FAFBFA",
    paddingHorizontal: 12,
    minHeight: 46,
  },
  iconWrap: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    paddingVertical: 10,
  },
});

// ─── Estilos de la pantalla ────────────────────────────────────────────────

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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: Platform.OS === "web" ? "center" : "flex-end",
    alignItems: Platform.OS === "web" ? "center" : "stretch",
    padding: Platform.OS === "web" ? 24 : 0,
  },
  modalCard: {
    backgroundColor: Colors.white,
    borderRadius: Platform.OS === "web" ? 20 : 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    maxWidth: Platform.OS === "web" ? 640 : undefined,
    maxHeight: Platform.OS === "web" ? "90%" : "92%",
    overflow: "hidden",
    shadowColor: Colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  modalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.primary100,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: Colors.text },
  modalSubtitle: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  modalDivider: { height: 1, backgroundColor: "#F0F2F0" },
  modalScroll: { flexGrow: 0 },
  modalScrollContent: {
    padding: 20,
    gap: 24,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  categoryRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E2E8E4",
    backgroundColor: Colors.white,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: { fontSize: 13, fontWeight: "500", color: Colors.text },
  categoryChipTextActive: { color: Colors.white, fontWeight: "700" },
  profitPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary50,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary100,
  },
  profitPreviewText: { fontSize: 13, color: Colors.textMuted },
  profitPreviewValue: { fontWeight: "700", color: Colors.primary },
  modalFooter: {
    flexDirection: "row",
    gap: 10,
    padding: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  cancelBtnText: { color: Colors.textMuted, fontWeight: "600", fontSize: 14 },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnText: { color: Colors.white, fontWeight: "700", fontSize: 14 },
});
