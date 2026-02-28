import { useQuery, useMutation } from "@tanstack/react-query"
import { useParams } from "react-router"
import { Helmet } from "react-helmet"
import { useFieldArray, useForm } from "react-hook-form"
import { GetPlan, UpdatePlan } from "../requests"
import styles from "./planpage.module.css"
import type { Plan, PlanSlide } from "../types"
import { useEffect, useMemo } from "react"
import debounce from "debounce"

function PlanPage() {
    const planId = useParams()
    const pointId = Number(planId.id)

    const { status, data, error } = useQuery({
        queryKey: ['plans', pointId],
        queryFn: async () => await GetPlan(pointId),
    })

    if (status === 'pending') {
        return <span>Загрузка...</span>
    }

    if (status === 'error') {
        return <span>Ошибка: {error.message}</span>
    }

    return (
        <>
            <Helmet>
                <title>{data.shortDescription}</title>
            </Helmet>
            <div className={styles.mainContainer}>
                <h1>Редактируйте</h1>
                <a>Здесь вы можете отредактировать текст каждого слайда и дополнительно настроить свою презентацию</a>
                <div className={styles.planContainer}>
                    <h2>Содержание</h2>
                    <ChangePlan {...data} />
                </div>
            </div>
            <div className={styles.submitButton}>
                <button className="button-yellow">Сгенерировать</button>
            </div>
        </>
    )
}

function ChangePlan(data: Plan) {
    const { control, subscribe, register } = useForm({ defaultValues: { fields: data.plan } })

    const { fields, remove, append } = useFieldArray({
        control,
        name: "fields"
    })

    const savePlan = useMutation({
        mutationFn: async (updatedPlan: PlanSlide[]) =>
            await UpdatePlan(updatedPlan, data.id),
    })

    const debounceSave = useMemo(
        () =>
            debounce((data) => {
                savePlan.mutate(data)
            }, 500),
        [savePlan]
    )

    useEffect(() => {
        const callback = subscribe({
            formState: {
                values: true,
                isDirty: true
            },
            callback: ({ values, isDirty }) => {
                if (!isDirty) return
                debounceSave({ plan: values.fields })
            },
        })

        return () => callback()
    }, [subscribe])

    return (
        <form>
            <ul className={styles.planlist}>
                {fields.map((field, fieldId) => (
                    <li key={fieldId} className={styles.planPoint}>
                        <h2>{fieldId + 1}</h2>
                        <div>
                            <div>
                                <input className={styles.slideTitle} {...register(`fields.${fieldId}.title`)} key={field.id} />
                                <button>s</button>
                            </div>
                            <ul className={styles.points}>
                                {field.points?.map((_, pointIndex) => (
                                    <li className={styles.pointitem}>
                                        <input {...register(`fields.${fieldId}.points.${pointIndex}`)} key={pointIndex} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>

        </form>
    )
}

export default PlanPage