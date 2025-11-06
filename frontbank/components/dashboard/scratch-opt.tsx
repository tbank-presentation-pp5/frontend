import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type Props = {
  onBack: () => void;
};

export const Scratch = ({ onBack }: Props) => {
  const handleBack = () => onBack();

  return (
    <div className="flex flex-col justify-center">
      <div className="flex gap-3 items-center justify-center pr-16 mb-6">
        <Image src={"/AI.svg"} width={64} height={64} alt="" />
        <h1 className="text-h1">Генерируем</h1>
      </div>
      <a className="text-center font-light mb-16">
        О чем будет ваша презентация?
      </a>
      <div className="w-[950px] h-80 rounded-3xl bg-accent2">
        <Input className="bg-main w-24" />
        <div></div>
      </div>
      <Button onClick={handleBack} variant={"white"}>
        Назад
      </Button>
    </div>
  );
};
