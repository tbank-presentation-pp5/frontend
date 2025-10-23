"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button variant="outline" onClick={() => toast.error("freaky твин")}>
        Потрогай меня твин...
      </Button>
    </div>
  );
}
