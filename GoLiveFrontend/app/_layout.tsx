import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="Account" options={{ headerShown: false }} />
        <Stack.Screen name="ConfirmDeleteAccount" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" options={{ headerShown: false }} />
        <Stack.Screen name="Subscriptions" options={{ headerShown: false }} />
        <Stack.Screen name="PrimeLogout" options={{ headerShown: false }} />
        <Stack.Screen name="DisableAccount" options={{ headerShown: false }} />
        <Stack.Screen name="ChangeEmail" options={{ headerShown: false }} />
        <Stack.Screen name="Privacy" options={{ headerShown: false }} />
        <Stack.Screen name="Terms" options={{ headerShown: false }} />
        <Stack.Screen name="Help" options={{ headerShown: false }} />
        <Stack.Screen name="NotificationSettings" options={{ headerShown: false }} />
        <Stack.Screen name="TestOffline" options={{ headerShown: false }} />
        <Stack.Screen name="TestError" options={{ headerShown: false }} />
        <Stack.Screen name="BitsPayments" options={{ headerShown: false }} />
        <Stack.Screen name="stream/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="PrivacySettings" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
