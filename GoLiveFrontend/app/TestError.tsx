import ErrorState from "./ErrorState";
import { useRouter } from "expo-router";

export default function TestError() {
  const router = useRouter();
  return <ErrorState message="This is a test error." onRetry={() => {}} onRetrySuccess={() => router.back()} />;
} 