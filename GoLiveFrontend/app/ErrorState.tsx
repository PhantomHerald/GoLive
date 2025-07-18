import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { AlertTriangle } from "lucide-react-native";
import React, { useState } from "react";

export default function ErrorState({ message = "Something went wrong.", onRetry, onRetrySuccess }: { message?: string; onRetry?: () => void; onRetrySuccess?: () => void }) {
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    if (onRetry) onRetry();
    setTimeout(() => {
      setLoading(false);
      if (onRetrySuccess) onRetrySuccess();
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size={48} color="#E91916" style={{ marginBottom: 24 }} />
          <AlertTriangle size={64} color="#E91916" style={{ marginBottom: 24, opacity: 0.3 }} />
        </>
      ) : (
        <AlertTriangle size={64} color="#E91916" style={{ marginBottom: 24 }} />
      )}
      <Text style={styles.title}>Error</Text>
      <Text style={styles.message}>
        {loading ? "Trying to resolve the error..." : message}
      </Text>
      {onRetry && !loading && (
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry} disabled={loading}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#0e0e10",
    padding: 32,
    marginTop: 64,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  message: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#BF94FE",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  retryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
}); 