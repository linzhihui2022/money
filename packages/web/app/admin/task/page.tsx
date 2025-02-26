import { TaskCalendar } from "@/features/task/ui/task-calendar";
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
  let index = range[0];
  const days = [];
  while (index < range[1]) {
    days.push(index);
    index = addDays(index, 1);
  }
  return (
    <div>
      <TaskCalendar tasks={tasks} days={days} month={startOfMonth(date)} />
    </div>
  );
}
