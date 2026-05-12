import { Link, useParams } from "react-router";
import { PropagateLoader } from "react-spinners";
import styles from "./presentation.module.css";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { GetPresentation } from "../requests";
import { SLIDE_COMPONENTS } from "./registry";
import { ExportDropdown } from "./ExportDropdown";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from "react";
import { wsManager } from "../ws/websocketManager";


function Presentation() {
    const presId = Number(useParams().id)

    const { status, data, error } = useQuery({
        queryKey: ['presentation', presId],
        queryFn: async () => await GetPresentation(presId),
    })

    useEffect(() => {
        if (!isNaN(presId)) {
            wsManager.connect(presId)
        }
        return () => {
            wsManager.disconnect()
        }
    }, [presId])

    if (status === 'pending') {
        return <div className={styles.loader}><PropagateLoader color="#333333" /></div>
    }

    if (status === 'error') {
        return <span>Ошибка: {error.message}</span>
    }

    return (
        <GoogleOAuthProvider clientId="213560270121-3r4b1dggeg4ilbcgdka1cmfh3cumcfrm.apps.googleusercontent.com">
            <div>
                <Helmet>
                    <title>Просматривайте и редактируйте презентацию</title>
                </Helmet>
                <div className={styles.headerCont}>
                    <div className={styles.header}>
                        <div>{data.name}</div>
                        <div className={styles.headerdiv}>
                            <Link className="button-white" to={'/'}>Вернуться на главную</Link>
                            <Link className="button-white" to={`/watch-presentations/${presId}`}>Режим докладчика</Link>
                            <ExportDropdown presId={presId} />
                        </div>
                    </div>
                </div>

                <div className={styles.presentation}>
                    {data.slides.map((slide: any) => {
                        const Component = SLIDE_COMPONENTS[slide.type]?.[slide.templateSlideId];

                        return (
                            <div key={slide.slideId} className={styles.slideWrapper}>
                                {Component ? (
                                    <Component
                                        slide={slide}
                                        createdAt={data.createdAt}
                                        styles={styles}
                                        isViewer={false}
                                    />
                                ) : (
                                    <div className={styles.errorBanner}>
                                        Шаблон {slide.templateSlideId} ({slide.type}) еще не готов.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* <div className={styles.presentation}>
                {data.slides.map((slide) => (
                    <div key={slide.slideId}>
                        {renderSlide(slide, data.createdAt)}
                    </div>
                ))}
            </div> */}
            </div>
        </GoogleOAuthProvider>
    )
}

export default Presentation;

// const renderSlide = (slide: Slide, createdAt: Date) => {
//     switch (slide.type) {
//         case "SECTION":
//             return (
//                 <div className={styles.sectionSlide}>
//                     <div className={styles.sectionLeft}>
//                         <img src="/tbank.png" />
//                     </div>
//                     {slide.content.map((field) => (
//                         <div key={field.fieldId} className={styles.sectionRight}>
//                             {field.value}
//                         </div>
//                     ))}
//                 </div>
//             )
//         case "MAIN":
//             return (
//                 <div className={styles.mainSlide}>
//                     <img src="/tbank.png" />
//                     {slide.content.map((field) => (
//                         <div key={field.fieldId} className={styles.mainField}>
//                             {field.value}
//                         </div>
//                     ))}
//                     <div className={styles.mainCred}>
//                         <a>Автор презентации: akiraduck</a>
//                         {new Date(createdAt).toLocaleString('ru-RU')}
//                     </div>
//                 </div>
//             )
//         case "TEXT_WITH_IMAGE":
//             const textFields = slide.content.filter((field) => field.type === "TEXT");
//             const imageFields = slide.content.filter((field) => field.type === "IMAGE");;

//             const titleField = textFields.find((field) => field.key === "title");
//             const textField = textFields.find((field) => field.key !== "title");

//             return (
//                 <div className={styles.imageSlide}>
//                     {titleField && (
//                         <div className={styles.imageTitle}>
//                             {titleField.value}
//                         </div>
//                     )}

//                     <div className={styles.textContainer}>
//                         {textField && (
//                             <div>
//                                 {textField.value}
//                             </div>
//                         )}
//                         {imageFields.map((field) => (
//                             <img
//                                 key={field.fieldId}
//                                 src={field.image.url}
//                                 alt={field.value}
//                             />
//                         ))}
//                     </div>

//                     {slide.isNeedPageNumber
//                         ? <div className={styles.pageNumber}>{slide.orderNumber}</div>
//                         : <div className={styles.pageNumber}></div>}
//                 </div>
//             )
//         case "PROS_AND_CONS": {
//             const title = slide.content.find(item => item.key === "title");
//             const prosTitle = slide.content.find(item => item.key === "pros_title");
//             const prosText = slide.content.find(item => item.key === "pros_text");
//             const consTitle = slide.content.find(item => item.key === "cons_title");
//             const consText = slide.content.find(item => item.key === "cons_text");

//             return (
//                 <div className={styles.sectionSlide}>
//                     <div className={styles.prosConsLeft}>
//                         <h1>{title ? title.value : ""}</h1>
//                     </div>
//                     <div className={styles.prosConsRight}>
//                         <div>
//                             <div className={styles.prosConsIcon}>
//                                 <img src="/pros.png" alt="Pros" />
//                                 <div>{prosTitle ? prosTitle.value : ""}</div>
//                             </div>
//                             <div className={styles.prosConsText}>
//                                 {prosText ? prosText.value : ""}
//                             </div>
//                         </div>
//                         <div>
//                             <div className={styles.prosConsIcon}>
//                                 <img src="/cons.png" alt="Cons" />
//                                 <div>{consTitle ? consTitle.value : ""}</div>
//                             </div>
//                             <div className={styles.prosConsText}>
//                                 {consText ? consText.value : ""}
//                             </div>
//                         </div>
//                     </div>
//                     {slide.isNeedPageNumber
//                         ? <div className={styles.pageNumberPros}>{slide.orderNumber}</div>
//                         : <div className={styles.pageNumberPros}></div>}
//                 </div>
//             );
//         }

//         case "SIX_POINTS":
//             const titleItem = slide.content.find(item => item.key === "title");
//             return (
//                 <div className={styles.sixPoints}>
//                     <h1>{titleItem ? titleItem.value : ""}</h1>

//                     <div className={styles.sixPointsGrid}>
//                         {[1, 2, 3, 4, 5, 6].map(pointNum => {
//                             const subtitle = slide.content.find(item => item.key === `point_${pointNum}_subtitle`);
//                             const text = slide.content.find(item => item.key === `point_${pointNum}_text`);

//                             if (!subtitle || !text) return null;

//                             return (
//                                 <div key={pointNum} className={styles.pointItem}>
//                                     <h2 className={styles.pointSubtitle}>{subtitle.value}</h2>
//                                     <p className={styles.pointText}>{text.value}</p>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                     <div className={styles.pageNumber}>{slide.orderNumber}</div>
//                 </div>
//             );

//         default:
//             return null
//     }
// };
