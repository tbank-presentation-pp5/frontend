import { usePage, useActions } from "./useGenerateStore"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Helmet } from "react-helmet"
import styles from './generate.module.css'
import { GeneratePlan } from "../requests"
import { useNavigate } from "react-router"
import { PropagateLoader } from "react-spinners"
import { type PlanPrompt } from "../types"

function Generate() {
    const page = usePage();
    const { setPage } = useActions();

    if (page === 'zero') {
        return <Zero />
    }

    if (page === 'text') {
        return <Text />
    }

    if (page === 'file') {
        return <File />
    }

    return (
        <div className={styles.mainContainer}>
            <Helmet>
                <title>Создайте вашу презентацию</title>
            </Helmet>
            <h1>С чего начнем?</h1>
            <a>Сгенерируйте с нуля, загрузите уже существующий файл или вставьте текст своей презентации</a>
            <div className={styles.cardsContainer}>
                <button className={styles.generateCard} onClick={() => setPage('zero')}>
                    <img src="./AI.png" />
                    <h2>Сгенерируйте</h2>
                    <a>Напишите тему презентации, ИИ сделает все остальное</a>
                </button>
                <button className={styles.generateCard} onClick={() => setPage('zero')}>
                    <img src="./upload.png" />
                    <h2>Загрузите файл</h2>
                    <a>Загрузите файл со своей системы или гугл диска</a>
                </button>
                <button className={styles.generateCard} onClick={() => setPage('zero')}>
                    <img src="./write.png" />
                    <h2>Вставьте текст</h2>
                    <a>Файл не открывается? Вставьте его содержание</a>
                </button>
            </div>
        </div>
    )
}

function Zero() {
    const { clearPage } = useActions()
    const navigate = useNavigate()
    const generatePlan = useMutation({
        mutationFn: async (data: PlanPrompt) => {
            return await GeneratePlan(data)
        },
        onSuccess: (data) => {
            console.log("План создан успешно")
            navigate(`/plans/${data.id}`)
        },
    })

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PlanPrompt>();
    const onSubmit: SubmitHandler<PlanPrompt> = (data) => {
        generatePlan.mutate(data)
    };

    if (generatePlan.isPending) {
        return <div className={styles.loader}><PropagateLoader color="#333333" /></div>
    }

    if (generatePlan.isError) {
        return <span>{generatePlan.error.message}</span>
    }

    return (
        <div className={styles.mainContainer}>
            <Helmet>
                <title>Создание по промпту</title>
            </Helmet>
            <div className={styles.flex}>
                <img src="./AI.png" />
                <h1>Генерируем</h1>
            </div>
            <a>О чем будет ваша презентация?</a>
            <form className={styles.promptForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.flex}>
                    <span>Cлайдов:</span>
                    <input defaultValue={10} {...register("numberOfSlides")} />
                </div>
                <div className={styles.flex}>
                    <input {...register("shortDescription", { required: true })} />
                    <button type="submit" className="button-yellow">Go</button>
                </div>
                {errors.shortDescription && <span>Это поле обязательно</span>}
            </form>
            <button className="button-white" onClick={() => clearPage()}>Вернуться обратно</button>
        </div>
    )
}

function Text() {
    return (
        <div>PIPO PIPO</div>
    )
}

function File() {
    return (
        <div>ALU FRAND DE VENUE</div>
    )
}

export default Generate