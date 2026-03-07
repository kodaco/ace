import { CostEstimator } from "@/features/core/components";
import { AppHero } from "./AppHero";
import { HowItWorks } from "./HowItWorks";

export default function Home() {
  return (
    <>
      <AppHero />
      <HowItWorks />
      <div id="calculator">
        <CostEstimator />
      </div>
    </>
  );
}
