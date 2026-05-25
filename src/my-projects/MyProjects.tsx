import { Helmet } from "react-helmet"
import { Link, useNavigate } from "react-router"
import Header from "../ui/header/Header"
import styles from "./myprojects.module.css"
import { useQuery } from "@tanstack/react-query"
import { GetPreviews } from "../requests"
import { DotLoader } from "react-spinners"
import { useState, useRef } from "react"

const PAGE_SIZE = 16

interface CardProps {
    presentationId: number
    name: string
    updatedAt: number
    previewUrls: string[]
}

function PreviewCard({ presentationId, name, updatedAt, previewUrls }: CardProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const navigate = useNavigate()
    const touchStartX = useRef(0)
    const touchStartY = useRef(0)
    const didSwipe = useRef(false)

    const slides = previewUrls.filter(Boolean)
    const currentIndex = activeIndex ?? 0
    const displayUrl = slides[currentIndex] ?? null

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        setActiveIndex(Math.min(Math.floor((x / rect.width) * slides.length), slides.length - 1))
    }
    const handleMouseLeave = () => setActiveIndex(null)

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchStartY.current = e.touches[0].clientY
        didSwipe.current = false
    }
    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current
        const dy = e.changedTouches[0].clientY - touchStartY.current
        if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.5) {
            didSwipe.current = true
            dx < 0
                ? setActiveIndex(Math.min(currentIndex + 1, slides.length - 1))
                : setActiveIndex(Math.max(currentIndex - 1, 0))
        }
    }

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActiveIndex(Math.max(currentIndex - 1, 0))
    }
    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation()
        setActiveIndex(Math.min(currentIndex + 1, slides.length - 1))
    }

    const handleCardClick = () => {
        if (!didSwipe.current) navigate(`/presentations/${presentationId}`)
        didSwipe.current = false
    }

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div
                className={styles.cardImgWrap}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {displayUrl
                    ? <img src={displayUrl} className={styles.cardImg} alt={name} />
                    : <div className={styles.cardImgPlaceholder} />}

                {slides.length > 1 && (
                    <>
                        <button className={`${styles.cardNavBtn} ${styles.cardNavBtnPrev}`} onClick={prevSlide} disabled={currentIndex === 0}>‹</button>
                        <button className={`${styles.cardNavBtn} ${styles.cardNavBtnNext}`} onClick={nextSlide} disabled={currentIndex === slides.length - 1}>›</button>
                        <div className={styles.cardIndicator}>
                            {slides.map((_, i) => (
                                <div
                                    key={i}
                                    className={`${styles.cardIndicatorSegment} ${currentIndex === i ? styles.cardIndicatorSegmentActive : ""}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <span className={styles.text}>{name}</span>
            <span className={styles.lastUpdated}>Обновлено: {new Date(updatedAt * 1000).toLocaleString('ru-RU')}</span>
        </div>
    )
}

function MyProjects() {
    const [page, setPage] = useState(0)

    const { data, isLoading } = useQuery({
        queryKey: ["presentations", page],
        queryFn: async () => await GetPreviews(page, PAGE_SIZE),
    })

    const totalPages = data?.totalElements ?? 1

    return (
        <>
            <Helmet>
                <title>Конструктор презентаций</title>
            </Helmet>
            <Header />
            <div className={styles.mainContainer}>
                <h1>Ваши презентации</h1>
                {isLoading ? (
                    <div className={styles.loaderContainer}>
                        <DotLoader color="#6F6F71" />
                    </div>
                ) : (
                    <>
                        <div className={styles.cardsContainer}>
                            {data?.elements.map((item) => (
                                <PreviewCard
                                    key={item.presentationId}
                                    presentationId={item.presentationId}
                                    name={item.name}
                                    updatedAt={item.updatedAt}
                                    previewUrls={item.previewUrls}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className={styles.pagination}>
                                <button
                                    className={styles.pageBtn}
                                    onClick={() => setPage(p => p - 1)}
                                    disabled={page === 0}
                                >
                                    ←
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        className={`${styles.pageBtn} ${i === page ? styles.pageBtnActive : ""}`}
                                        onClick={() => setPage(i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className={styles.pageBtn}
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= totalPages - 1}
                                >
                                    →
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}

export default MyProjects
