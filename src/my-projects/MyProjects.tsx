import { Helmet } from "react-helmet"
import { Link } from "react-router"
import Header from "../ui/header/Header"
import styles from "./myprojects.module.css"
import { useQuery } from "@tanstack/react-query"
import { GetPreviews } from "../requests"

function MyProjects() {
    const { data } = useQuery({
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
                <div className={styles.cardsContainer}>
                    {data?.elements.map((item) => (
                        <Link key={item.presentationId} className={styles.card} to={`/presentations/${item.presentationId}`}>
                            <div className={styles.cardImg}>
                                <img src={item.previewUrls[0]} />
                            </div>
                            <a className={styles.text}>{item.name}</a>
                            <span className={styles.lastUpdated}>Обновлено: {new Date(item.updatedAt).toLocaleString('ru-RU')}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default MyProjects