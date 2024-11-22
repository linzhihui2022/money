import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { add } from "./action";

export default async function Page() {
  return (
    <form action={add} className="px-3 space-y-3 w-80">
      <div>
        <Label htmlFor="id">ID</Label>
        <Input name="id" id="id" />
      </div>
      <div>
        <Label htmlFor="value">Name</Label>
        <Input name="value" id="value" />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Input name="type" id="type" />

        {/*<Select name="type">*/}
        {/*  <SelectTrigger className="w-full">*/}
        {/*    <SelectValue placeholder={CategoryType.EXPENSES} />*/}
        {/*  </SelectTrigger>*/}
        {/*  <SelectContent>*/}
        {/*    <SelectItem value={CategoryType.EXPENSES}>{CategoryType.EXPENSES}</SelectItem>*/}
        {/*    <SelectItem value={CategoryType.INCOME}>{CategoryType.INCOME}</SelectItem>*/}
        {/*  </SelectContent>*/}
        {/*</Select>*/}
      </div>
      <div className="flex pt-4">
        <Button className="w-full">Add</Button>
      </div>
    </form>
  );
}
