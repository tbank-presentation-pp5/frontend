import Link from "next/link";
import { Button } from "../ui/button";

interface CardContent {
  h2: string;
  subtext: string;
  bg_photo: string;
  link: string;
  query: {};
  button_text: string;
}

interface CardPropsMap {
  leftCard: CardContent;
  rightCard: CardContent;
}

const cardContent: CardPropsMap = {
  leftCard: {
    h2: "Создайте презентацию с нуля",
    subtext: "Начните новый проект с генерации текста и выбора шаблона",
    bg_photo: "/main_card_1.png",
    link: "/dashboard",
    query: { option: "scratch" },
    button_text: "Открыть конструктор",
  },
  rightCard: {
    h2: "Начните работу с файла",
    subtext: "Загрузите текстовый документ или готовую презентацию",
    bg_photo: "/main_card_2.png",
    link: "/dashboard",
    query: { option: "text" },
    button_text: "Загрузить файл",
  },
};

interface CardProps {
  variant: keyof CardPropsMap;
}

export function Card({ variant }: CardProps) {
  const content = cardContent[variant];

  return (
    <div
      className="w-[528px] bg-secondary rounded-2xl"
      style={{ backgroundImage: `url(${content.bg_photo})` }}
    >
      {/* <Image src={content.bg_photo} alt="" width={528} height={408} /> */}
      <div className="px-5 py-10 flex flex-col items-center">
        <h2 className="font-medium font-tinkoff text-2xl mb-3">{content.h2}</h2>
        <a className="mb-54">{content.subtext}</a>
        <Link href={{ pathname: content.link, query: content.query }}>
          <Button variant="white">{content.button_text}</Button>
        </Link>
      </div>
    </div>
  );
}
