import React from "react";
import { BillList } from "./billList";

export default function Page(props: { searchParams: Promise<{ category: string; account: string }> }) {
  return <BillList searchParams={props.searchParams} />;
}
