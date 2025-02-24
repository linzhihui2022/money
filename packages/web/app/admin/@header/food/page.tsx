import { Header } from "@/components/ui/header";
import { AddFoodDialog } from "@/features/food/ui/add-dialog";

export default async function Page() {
  return (
    <Header>
      <AddFoodDialog />
    </Header>
  );
}
