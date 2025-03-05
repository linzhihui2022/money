import { TaskPanel } from "@/features/task/ui/task-panel";
import { getCookbooksFilterStock } from "api/cookbook";
import { getFoods } from "api/food";
import { getTasks } from "api/task";
import {
  addDays,
  addMonths,
  endOfWeek,
  isValid,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const initRange = (base: Date = new Date()) => {
  const month = startOfMonth(base);
  const start = startOfWeek(month, { weekStartsOn: 1 });
  const nextMonth = addMonths(month, 1);
  const end = endOfWeek(nextMonth, { weekStartsOn: 1 });
  return [start, end] satisfies [Date, Date];
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const dateFromSearchParams = (await searchParams).date;
  const date = isValid(new Date(dateFromSearchParams))
    ? new Date(dateFromSearchParams)
    : new Date();
  const range = initRange(date);
  const tasks = await getTasks(range);
  const foods = await getFoods();
  const cookbooks = await getCookbooksFilterStock();
  let index = range[0];
  const days = [];
  while (index < range[1]) {
    days.push(index);
    index = addDays(index, 1);
  }
  return (
    <div>
      <TaskPanel
        foods={foods}
        tasks={tasks}
        days={days}
        month={startOfMonth(date)}
        cookbooks={cookbooks}
      />
    </div>
  );
}
