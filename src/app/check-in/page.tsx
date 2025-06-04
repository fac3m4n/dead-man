import { createClient } from "@/utils/supabase/server";

export default async function CheckIn({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  const supabase = await createClient();
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*")
    .eq("wallet_address", searchParams.address);
  console.log(checkIns);
  return <div>CheckIn</div>;
}
