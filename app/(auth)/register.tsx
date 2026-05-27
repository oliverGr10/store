import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { authService } from "@/services/authService";
import { Colors } from "@/constants/colors";
import { Icon } from "@/components/ui/Icon";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await authService.register(email, password);
      Alert.alert("¡Listo!", "Cuenta creada. Ya puedes ingresar.", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Icon
                name="person-add-outline"
                size={34}
                color={Colors.primary}
              />
            </View>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Empieza a digitalizar tu bodega</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Icon name="person-outline" size={18} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="Tu nombre"
                placeholderTextColor={Colors.gray500}
                value={name}
                onChangeText={setName}
              />
            </View>
            <View style={styles.inputWrap}>
              <Icon name="mail-outline" size={18} color={Colors.gray500} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.gray500}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputWrap}>
              <Icon
                name="lock-closed-outline"
                size={18}
                color={Colors.gray500}
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña (mínimo 6 caracteres)"
                placeholderTextColor={Colors.gray500}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.back()}
            >
              <Text style={styles.linkText}>
                ¿Ya tienes cuenta? Inicia sesión
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 24,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  header: { alignItems: "center", gap: 8 },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.primary50,
    borderWidth: 1,
    borderColor: Colors.primary100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 28, fontWeight: "700", color: Colors.primary },
  subtitle: { fontSize: 15, color: Colors.textMuted },
  form: { gap: 12 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.gray50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 54,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: "600" },
  linkButton: { alignItems: "center", marginTop: 8 },
  linkText: { color: Colors.primary, fontSize: 14, fontWeight: "500" },
});
