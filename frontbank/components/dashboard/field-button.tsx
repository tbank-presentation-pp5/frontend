import Image from "next/image";
import { MouseEventHandler } from "react";

interface CardProps {
  photo: string;
  h1: string;
  text: string;
}

interface FieldButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  cardProps: CardProps;
}

export default function FieldButton({onClick, cardProps}: FieldButtonProps) {
  return (
    <button
      style={{
        all: "unset",
        cursor: "pointer",
        display: "inline-block",
      }}
      onClick={onClick}
      type="button"
      
    >
      <div className="w-[269px] h-[246px] bg-secondary rounded-3xl">
        <div className="px-8 py-10 flex flex-col">
          <Image
            className="mb-6 h-16"
            src={cardProps.photo}
            alt=""
            height={64}
            width={64}
          />
          <h1 className="font-tinkoff text-2xl mb-3 font-medium">
            {cardProps.h1} 
          </h1>
          <span className="text-sm">
            {cardProps.text}
          </span>
        </div>
      </div>
    </button>
  );
}
