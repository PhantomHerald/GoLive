import { Redirect } from "expo-router";
import ApiTest from "../components/ApiTest";

export default function Index() {
  // Redirect to the original onboarding page
  return <Redirect href="/(auth)/onboarding" />;
  
  // Uncomment the next line if you need to test API connectivity again
  // return <ApiTest />;
}
