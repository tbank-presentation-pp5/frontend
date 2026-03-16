import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import { GetPresentation } from "../requests"
import { PropagateLoader } from "react-spinners"
import type { Presentation, Slide } from "../types"
import styles from "./presentation.module.css"
import { useAddPresentation } from "./useLastPresentationsStore"


function Presentation() {
    const presId = Number(useParams().id)
    const addPresentation = useAddPresentation();

    const { status, data, error } = useQuery({
        queryKey: ['presentation', presId],
        queryFn: async () => await GetPresentation(presId),
    })

    if (status === 'pending') {
        return <div><PropagateLoader color="#333333" /></div>
    }

    if (status === 'error') {
        return <span>Ошибка: {error.message}</span>
    }

    if (status === 'success') {
        const presentation = {
            id: presId,
            title: data.name,
            mainSlide: "hello",
        };
        addPresentation(presentation);
    }

    return (
        <div>
            <div className={styles.headerCont}>
                <div className={styles.header}>
                    <div>{data.name}</div>
                    <button className="button-yellow">
                        Закрыть презентацию
                    </button>
                </div>
            </div>

            <div className={styles.presentation}>
                {data.slides.map((slide) => (
                    <div key={slide.slideId}>
                        {slide.type}
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
                        <a>Автор презентации</a>
                        {createdAt.toString()}
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
                                <div>{slide.content[1].value}</div>
                            </div>
                            <div className={styles.prosConsText}>
                                {slide.content[0].value}
                            </div>
                        </div>
                        <div>
                            <div className={styles.prosConsIcon}>
                                <img src="/cons.png" />
                                <div>{slide.content[3].value}</div>
                            </div>
                            <div className={styles.prosConsText}>
                                {slide.content[2].value}
                            </div>
                        </div>
                    </div>
                    {slide.isNeedPageNumber
                        ? <div className={styles.pageNumberPros}>{slide.slideId}</div>
                        : <div className={styles.pageNumberPros}></div>}
                </div>
            )

        default:
            return null
    }
};

export default Presentation

