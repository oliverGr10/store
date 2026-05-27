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
} from "react-native";
import { Link, router } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import { Colors } from "@/constants/colors";
import { Icon } from "@/components/ui/Icon";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Ingresa tu email y contraseña");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(email, password);
      await setAuth(res.access_token, { id: res.user_id, email: res.email });
      // Limpiar cache viejo para que todo se refetch con el token nuevo
      const { queryClient } = await import('@/app/_layout');
      queryClient.clear();
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Icon name="storefront-outline" size={34} color={Colors.primary} />
          </View>
          <Text style={styles.title}>BodegaApp</Text>
          <Text style={styles.subtitle}>Digitaliza tu bodega</Text>
        </View>

        <View style={styles.form}>
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
            <Icon name="lock-closed-outline" size={18} color={Colors.gray500} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={Colors.gray500}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Ingresando..." : "Ingresar"}
            </Text>
          </TouchableOpacity>

          <Link href="/(auth)/register" asChild>
            <TouchableOpacity style={styles.linkButton}>
              <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 440,
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
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: -0.5,
  },
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
