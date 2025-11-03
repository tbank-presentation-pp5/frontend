"use client";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FieldButton from "@/components/dashboard/field-button";

export default function Dashboard() {
  const params = useSearchParams();
  const [mode, setMode] = useState<string | null>(params.get("option"));

  const RenderContent = () => {
    switch (mode) {
      case "scratch":
        return <div>SCRATCH</div>;
      case "file":
        return <div>FILE</div>;
      case "text":
        return <div>TEXT</div>;
      default:
        return <Choices setMode={setMode} />;
    }
  };

  return (
    <div className="flex flex-col justify-end min-h-screen">
      <Header />
      <div className="mx-auto mt-28 mb-60 h-max p-4">
        <RenderContent></RenderContent>
      </div>
      <Footer />
    </div>
  );
}

export function Choices({ setMode }: { setMode: (mode: string) => void }) {
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
          onClick={() => setMode("scratch")}
        />
        <FieldButton
          cardProps={{
            photo: "/upload.svg",
            h1: "Загрузите файл",
            text: "Загрузите файл со своей системы или гугл диска",
          }}
          onClick={() => setMode("file")}
        />
        <FieldButton
          cardProps={{
            photo: "/text.svg",
            h1: "Вставьте текст",
            text: "Файл не открывается? Вставьте его содержимое",
          }}
          onClick={() => setMode("text")}
        />
      </div>
    </div>
  );
}
