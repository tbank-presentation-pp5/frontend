import { Helmet } from "react-helmet"
import { Link } from "react-router"
import Header from "../ui/header/Header"
import styles from "./myprojects.module.css"
import { useQuery } from "@tanstack/react-query"
import { GetPreviews } from "../requests"
import { DotLoader } from "react-spinners"
import { useState } from "react"

const PAGE_SIZE = 16

interface CardProps {
    presentationId: number
    name: string
    updatedAt: number
    previewUrls: string[]
}

function PreviewCard({ presentationId, name, updatedAt, previewUrls }: CardProps) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    const slides = [...previewUrls].reverse()
    const displayUrl = slides[activeIndex ?? 0] ?? null

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const idx = Math.min(
            Math.floor((x / rect.width) * slides.length),
            slides.length - 1
        )
        setActiveIndex(idx)
    }

    const handleMouseLeave = () => setActiveIndex(null)

    return (
        <Link className={styles.card} to={`/presentations/${presentationId}`}>
            <div
                className={styles.cardImgWrap}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {displayUrl
                    ? <img src={displayUrl} className={styles.cardImg} alt={name} />
                    : <div className={styles.cardImgPlaceholder} />}

                {slides.length > 1 && (
                    <div className={styles.cardIndicator}>
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.cardIndicatorSegment} ${
                                    (activeIndex ?? 0) === i ? styles.cardIndicatorSegmentActive : ""
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
            <span className={styles.text}>{name}</span>
            <span className={styles.lastUpdated}>Обновлено: {new Date(updatedAt * 1000).toLocaleString('ru-RU')}</span>
        </Link>
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
