"use client";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { usePromptStore, page } from "@/store/usePromptStore";
import FieldButton from "@/components/dashboard/field-button";
import { Scratch } from "@/components/dashboard/scratch-opt";

export default function Dashboard() {
  const { page, setPage } = usePromptStore();

  const handleBack = () => {
    setPage("create");
  };

  const RenderContent = () => {
    switch (page) {
      case "create":
        return <Choices setPage={setPage} />;
      case "ai":
        return <Scratch onBack={handleBack} />;
      case "file":
        return <div>FILE</div>;
      case "text":
        return <div>TEXT</div>;
      default:
        return null;
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
