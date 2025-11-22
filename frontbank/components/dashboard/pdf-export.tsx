"use client";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";
import { Slide } from "@/services/types";
import { ImageSlide } from "./slides/image-slide";
import { MainSlide } from "./slides/main-slide";
import { SectionSlide } from "./slides/section-slide";
import { Button } from "../ui/button";

interface PDFExportProps {
  slides: Slide[];
  presentationName: string;
}

export const PDFExport: React.FC<PDFExportProps> = ({
  slides,
  presentationName,
}) => {
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  const exportToPdf = async () => {
    if (!slidesContainerRef.current) return;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1920, 1080]
    });

    const slideElements = slidesContainerRef.current.querySelectorAll(".pdf-slide");

    for (let i = 0; i < slideElements.length; i++) {
      const slideElement = slideElements[i] as HTMLElement;
      
      // Use lower scale for smaller file size (0.75 for balance between quality and size)
      const canvas = await html2canvas(slideElement, {
        scale: 0.75,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        imageTimeout: 0,
        removeContainer: true
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.8); // Use JPEG with 80% quality for smaller size
      
      if (i > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
    }

    pdf.save(`${presentationName}.pdf`);
  };

  const renderSlideComponent = (slide: Slide) => {
    switch (slide.type) {
      case "MAIN":
        return <MainSlide slide={slide} />;
      case "SECTION":
        return <SectionSlide slide={slide} />;
      case "TEXT_WITH_IMAGE":
        return <ImageSlide slide={slide} />;
      default:
        return (
          <div className="rounded-xl p-6 text-white w-full h-full bg-textd">
            Неизвестный тип слайда: {slide.type}
          </div>
        );
    }
  };

  return (
    <div>
      <Button onClick={exportToPdf} variant={"yellow"}>
        Экспорт в PDF
      </Button>

      {/* Hidden slides container for PDF generation */}
      <div 
        ref={slidesContainerRef}
        style={{ 
          position: "absolute", 
          left: "-9999px", 
          top: 0,
          visibility: "hidden" 
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.slideId}
            className="pdf-slide"
            style={{
              width: "1920px",
              height: "1080px",
              backgroundColor: "white",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box"
            }}
          >
            <div style={{ 
              transform: "scale(1.74)", // Scale to match 16:9 from original 1104x621
              transformOrigin: "center center",
              width: "1104px",
              height: "621px"
            }}>
              {renderSlideComponent(slide)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};