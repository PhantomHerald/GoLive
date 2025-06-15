import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function _layout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" />
        <Stack.Screen name="Signup" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="Contactsupport" />
        <Stack.Screen name="Forgotpassword" />
      </Stack>
    </>
  );
}
