import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import { GetPresentation } from "../requests"
import { PropagateLoader } from "react-spinners"
import type { Slide } from "../types"
import styles from "./presentation.module.css"
import { saveAs } from "file-saver"
import { Helmet } from "react-helmet"


function Presentation() {
    const presId = Number(useParams().id)

    const handleDownload = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/presentations/${presId}/pptx/download`);
            const blob = await response.blob();
            saveAs(blob, "download.pptx");
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    };

    const { status, data, error } = useQuery({
        queryKey: ['presentation', presId],
        queryFn: async () => await GetPresentation(presId),
    })

    if (status === 'pending') {
        return <div className={styles.loader}><PropagateLoader color="#333333" /></div>
    }

    if (status === 'error') {
        return <span>Ошибка: {error.message}</span>
    }

    return (
        <div>
            <Helmet>
                <title>Просматривайте и редактируйте презентацию</title>
            </Helmet>
            <div className={styles.headerCont}>
                <div className={styles.header}>
                    <div>{data.name}</div>
                    <div>
                        <button className="button-white" onClick={handleDownload}>
                            Экспортировать
                        </button>
                        <button className="button-yellow">
                            Закрыть презентацию
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.presentation}>
                {data.slides.map((slide) => (
                    <div key={slide.slideId}>
                        {renderSlide(slide, data.createdAt)}
                    </div>
                ))}
            </div>
        </div>
    )
}

const renderSlide = (slide: Slide, createdAt: Date) => {
    switch (slide.type) {
        case "SECTION":
            return (
                <div className={styles.sectionSlide}>
                    <div className={styles.sectionLeft}>
                        <img src="/tbank.png" />
                    </div>
                    {slide.content.map((field) => (
                        <div key={field.fieldId} className={styles.sectionRight}>
                            {field.value}
                        </div>
                    ))}
                </div>
            )
        case "MAIN":
            return (
                <div className={styles.mainSlide}>
                    <img src="/tbank.png" />
                    {slide.content.map((field) => (
                        <div key={field.fieldId} className={styles.mainField}>
                            {field.value}
                        </div>
                    ))}
                    <div className={styles.mainCred}>
                        <a>Автор презентации: akiraduck</a>
                        {new Date(createdAt).toLocaleString('ru-RU')}
                    </div>
                </div>
            )
        case "TEXT_WITH_IMAGE":
            const textFields = slide.content.filter((field) => field.type === "TEXT");
            const imageFields = slide.content.filter((field) => field.type === "IMAGE");;

            const titleField = textFields.find((field) => field.key === "title");
            const textField = textFields.find((field) => field.key !== "title");

            return (
                <div className={styles.imageSlide}>
                    {titleField && (
                        <div className={styles.imageTitle}>
                            {titleField.value}
                        </div>
                    )}

                    <div className={styles.textContainer}>
                        {textField && (
                            <div>
                                {textField.value}
                            </div>
                        )}
                        {imageFields.map((field) => (
                            <img
                                key={field.fieldId}
                                src={field.image.url}
                                alt={field.value}
                            />
                        ))}
                    </div>

                    {slide.isNeedPageNumber
                        ? <div className={styles.pageNumber}>{slide.slideId}</div>
                        : <div className={styles.pageNumber}></div>}
                </div>
            )
        case "PROS_AND_CONS":
            return (
                <div className={styles.sectionSlide}>
                    <div className={styles.prosConsLeft}>
                        <h1>{slide.content[4].value}</h1>
                    </div>
                    <div className={styles.prosConsRight}>
                        <div>
                            <div className={styles.prosConsIcon}>
                                <img src="/pros.png" />
                                <div>{slide.content[3].value}</div>
                            </div>
                            <div className={styles.prosConsText}>
                                {slide.content[2].value}
                            </div>
                        </div>
                        <div>
                            <div className={styles.prosConsIcon}>
                                <img src="/cons.png" />
                                <div>{slide.content[1].value}</div>
                            </div>
                            <div className={styles.prosConsText}>
                                {slide.content[0].value}
                            </div>
                        </div>
                    </div>
                    {slide.isNeedPageNumber
                        ? <div className={styles.pageNumberPros}>{slide.slideId}</div>
                        : <div className={styles.pageNumberPros}></div>}
                </div>
            )
        case "SIX_POINTS":
            return (
                <div className={styles.sixPoints}>
                    <h1>{slide.content[12].value}</h1>

                    <div className={styles.sixPointsGrid}>
                        {[1, 2, 3, 4, 5, 6].map(pointNum => {
                            const subtitle = slide.content.find(item => item.key === `point_${pointNum}_subtitle`);
                            const text = slide.content.find(item => item.key === `point_${pointNum}_text`);

                            if (!subtitle || !text) return null;

                            return (
                                <div key={pointNum} className={styles.pointItem}>
                                    <h2 className={styles.pointSubtitle}>{subtitle.value}</h2>
                                    <p className={styles.pointText}>{text.value}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.pageNumber}>{slide.slideId}</div>
                </div>
            )

        default:
            return null
    }
};

export default Presentation

