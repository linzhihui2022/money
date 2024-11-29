import React from "react";
import { BillList } from "./billList";

export default function Page(props: {
  searchParams: Promise<{ category: string; account: string }>;
}) {
  return (
    <div>
      <BillList searchParams={props.searchParams} />
    </div>
  );
}
