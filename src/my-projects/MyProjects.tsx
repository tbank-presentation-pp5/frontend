import { Helmet } from "react-helmet"
import { Link } from "react-router"
import Header from "../ui/header/Header"
import styles from "./myprojects.module.css"
import { useQuery } from "@tanstack/react-query"
import { GetPreviews } from "../requests"
import { DotLoader } from "react-spinners"

function MyProjects() {
    const { data, isLoading } = useQuery({
        queryKey: ["lastPresentations"],
        queryFn: async () => await GetPreviews(0, 16)
    })

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
                    <div className={styles.cardsContainer}>
                        {data?.elements.map((item) => (
                            <Link key={item.presentationId} className={styles.card} to={`/presentations/${item.presentationId}`}>
                                <div>
                                    {item.previewUrls?.[0]
                                        ? <img src={item.previewUrls[0]} className={styles.cardImg} />
                                        : <div className={styles.cardImgPlaceholder} />}
                                </div>
                                <span className={styles.text}>{item.name}</span>
                                <span className={styles.lastUpdated}>Обновлено: {new Date(item.updatedAt).toLocaleString('ru-RU')}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default MyProjects