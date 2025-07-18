import OfflineState from "./OfflineState";
import { useRouter } from "expo-router";

export default function TestOffline() {
  const router = useRouter();
  return <OfflineState onRetry={() => {}} onRetrySuccess={() => router.back()} />;
} 