import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { HabitsProvider } from "../src/context/HabitsContext";
export default function RootLayout() {
  return (
    <AuthProvider>
      <HabitsProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
      </HabitsProvider>
    </AuthProvider>
  );
}