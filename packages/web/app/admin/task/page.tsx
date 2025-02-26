import { TaskCalendar } from "@/features/task/ui/task-calendar";
import { getTasks } from "api/task";
import {
  addDays,
  addMonths,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  isValid,
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
  let index = range[0];
  const weeks = [];
  while (index < range[1]) {
    weeks.push(index);
    index = addDays(index, 7);
  }
  return (
    <div>
      <TaskCalendar tasks={tasks} weeks={weeks} month={startOfMonth(date)} />
    </div>
  );
}
