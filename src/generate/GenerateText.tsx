import { useForm, type SubmitHandler } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router"

import { type PlanPrompt } from "../types"
import { GeneratePlan } from "../requests"
import styles from "./generate.module.css"
import { Helmet } from "react-helmet"
import { FadeLoader } from "react-spinners"

function Text() {
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

    return (
        <div className={styles.mainContainer}>
            <Helmet>
                <title>Создание по промпту</title>
            </Helmet>
            <div className={styles.flex}>
                <img src="/public/AI.png" />
                <h1>Генерируем</h1>
            </div>
            <a>О чем будет ваша презентация?</a>
            <form className={styles.promptForm} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.flex}>
                    <span>Cлайдов:</span>
                    <input type="number"
                        placeholder="Количество слайдов"
                        {...register("numberOfSlides", {
                            valueAsNumber: true,
                            min: { value: 1, message: "Минимум 1" },
                            max: { value: 50, message: "Максимум 50" },
                        })} />
                </div>
                <div className={styles.flex}>
                    <input placeholder="Опишите презентацию..."
                        {...register("shortDescription", {
                            required: "Обязательно",
                            minLength: {
                                value: 10,
                                message: "Минимум 10 символов",
                            },
                        })} />
                    {generatePlan.isPending ? <FadeLoader color="#6F7071"/> : 
                    <button type="submit" className="button-yellow">Go</button>}
                </div>
                {errors.shortDescription && <span>Это поле обязательно</span>}
            </form>
            {generatePlan.isError && 
                <span>{generatePlan.error.message}</span>}
        </div>
    )
}

export default Text