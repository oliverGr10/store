import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { Colors } from "@/constants/colors";
import { Icon, IconName } from "@/components/ui/Icon";

const isWeb = Platform.OS === "web";

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      <Icon
        name={name}
        size={18}
        color={focused ? Colors.primary : Colors.gray500}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: isWeb ? "top" : "bottom",
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarStyle: isWeb ? styles.webTabBar : styles.mobileTabBar,
        tabBarItemStyle: isWeb ? styles.webTabItem : styles.mobileTabItem,
        tabBarLabelStyle: isWeb ? styles.webTabLabel : styles.mobileTabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="vender"
        options={{
          title: "Vender",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cart-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="productos"
        options={{
          title: "Productos",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="cube-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="fiados"
        options={{
          title: "Fiados",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="wallet-outline" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="reportes"
        options={{
          title: "IA",
          tabBarIcon: ({ focused }) => (
            <TabIcon name="sparkles-outline" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapFocused: {
    backgroundColor: Colors.primary50,
  },
  webTabBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: "#E5ECE7",
    height: 64,
    paddingHorizontal: 20,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  mobileTabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.border,
    height: 68,
    paddingTop: 8,
    paddingBottom: 6,
  },
  webTabItem: {
    width: "auto",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  mobileTabItem: {
    paddingVertical: 4,
  },
  webTabLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "none",
  },
  mobileTabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
});
