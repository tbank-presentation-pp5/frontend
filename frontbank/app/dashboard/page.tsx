"use client";
import { usePromptStore } from "@/store/usePromptStore";
import FieldButton from "@/components/dashboard/field-button";
import { Scratch } from "@/components/dashboard/scratch-opt";
import { Import } from "@/components/dashboard/import-opt";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { page } from "@/services/types";
import { Toaster } from "sonner";

export default function Dashboard() {
  const router = useRouter();
  const { page, setPage } = usePromptStore();

  const handleBack = () => {
    if (page === "create") {
      router.push("/");
    } else {
      setPage("create");
    }
  };

  const RenderContent = () => {
    switch (page) {
      case "create":
        return <Choices setPage={setPage} />;
      case "ai":
        return <Scratch />;
      case "file":
        return <Import />;
      case "text":
        return <div>TEXT</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className="fixed right-8 top-8 rounded-full w-14 h-14 bg-secondary flex justify-center cursor-pointer"
        onClick={handleBack}
      >
        <Image src={"/X.svg"} width={24} height={24} alt="" />
      </div>
      <div className="mx-auto mt-32 h-max p-4">
        <RenderContent></RenderContent>
      </div>
      <Toaster/>
    </div>
  );
}

export function Choices({ setPage }: { setPage: (page: page) => void }) {
  return (
    <div>
      <div className="text-center mb-16">
        <h1 className="text-h1 mb-6">С чего начнем?</h1>
        <a>
          Сгенерируйте с нуля, загрузите уже существующий файл или вставьте
          текст своей презентации
        </a>
      </div>
      <div className="flex flex-wrap gap-16 items-center justify-center">
        <FieldButton
          cardProps={{
            photo: "/AI.svg",
            h1: "Сгенерируйте",
            text: "Напишите тему презентации, ИИ сделает все остальное",
          }}
          onClick={() => setPage("ai")}
        />
        <FieldButton
          cardProps={{
            photo: "/upload.svg",
            h1: "Загрузите файл",
            text: "Загрузите файл со своей системы или гугл диска",
          }}
          onClick={() => setPage("file")}
        />
        <FieldButton
          cardProps={{
            photo: "/text.svg",
            h1: "Вставьте текст",
            text: "Файл не открывается? Вставьте его содержимое",
          }}
          onClick={() => setPage("text")}
        />
      </div>
    </div>
  );
}
