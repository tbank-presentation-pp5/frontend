import { Helmet } from "react-helmet"
import { Link } from "react-router"
import Header from "../ui/header/Header"
import styles from "./myprojects.module.css"
import { useQuery } from "@tanstack/react-query"
import { GetPreviews } from "../requests"
import { DotLoader } from "react-spinners"
import { useState } from "react"

const PAGE_SIZE = 16

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
                                <Link key={item.presentationId} className={styles.card} to={`/presentations/${item.presentationId}`}>
                                    <div>
                                        {item.previewUrls?.length > 0
                                            ? <img src={item.previewUrls[item.previewUrls.length - 1]} className={styles.cardImg} />
                                            : <div className={styles.cardImgPlaceholder} />}
                                    </div>
                                    <span className={styles.text}>{item.name}</span>
                                    <span className={styles.lastUpdated}>Обновлено: {new Date(item.updatedAt * 1000).toLocaleString('ru-RU')}</span>
                                </Link>
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
