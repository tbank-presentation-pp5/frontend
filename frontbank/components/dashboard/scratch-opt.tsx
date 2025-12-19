"use client";

import Image from "next/image";
import { Input } from "../ui/input";
import SimpleSlidesCarousel from "../ui/carousel";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { generatePresentationOutline } from "@/services/api/requests";
import { usePresentationOutlineStore } from "@/store/usePresentationOutlineStore";
import { PresentationOutlineView } from '@/components/presentation/outline-preview';

export const Scratch = () => {
  const [prompt, setPrompt] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { setCurrentOutline, setLoading, setError, clearCurrentOutline, currentOutline } =
    usePresentationOutlineStore();

  const slideOptions = [7, 10, 15];

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setLoading(true);
    setError(null);

    try {
      const outlineData = await generatePresentationOutline({
        numberOfSlides,
        shortDescription: prompt,
      });

      setCurrentOutline(outlineData);
      router.push(`/presentation/${outlineData.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Ошибка генерации");
      toast.error("Ошибка создания презентации");
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center">
        <Image
          src={"/windows-xp-gangster-edition.gif"}
          width={498}
          height={281}
          alt="wait until"
          unoptimized
        ></Image>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="flex gap-3 items-center justify-center pr-16 mb-6">
        <Image src={"/AI.svg"} width={64} height={64} alt="" />
        <h1 className="text-h1">Генерируем</h1>
      </div>
      <a className="text-center font-light mb-16">
        О чем будет ваша презентация?
      </a>
      <div className="w-[950px] rounded-3xl bg-accent2 flex flex-col gap-6 py-10 px-7">
        <div className="flex gap-6">
          <div className="bg-field h-11 w-46 rounded-lg flex justify-center items-center">
            <SimpleSlidesCarousel
              value={numberOfSlides}
              onChange={setNumberOfSlides}
              options={slideOptions}
              className="w-[100px]"
            />
          </div>
          <div className="bg-field h-11 rounded-lg flex justify-center items-center">
            <ToggleGroup type="single" defaultValue="16/9">
              <ToggleGroupItem value="16/9">16:9</ToggleGroupItem>
              <ToggleGroupItem value="4/3">4:3</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="flex gap-3.5">
          <Input
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            className="bg-field h-14"
            placeholder="Напишите тему своей презентации"
            maxLength={100}
            disabled={isLoading}
            value={prompt}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant={"next"}
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
            >
              <ChevronRight className="size-6" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
