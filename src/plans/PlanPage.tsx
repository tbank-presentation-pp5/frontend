import { useQuery, useMutation } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import { Helmet } from "react-helmet"
import { useFieldArray, useForm } from "react-hook-form"
import { GeneratePresentationFromPlan, GetPlan, UpdatePlan } from "../requests"
import styles from "./planpage.module.css"
import type { Plan, PlanSlide } from "../types"
import { useEffect, useMemo } from "react"
import debounce from "debounce"
import { useSortable } from '@dnd-kit/react/sortable'
import { DragDropProvider } from "@dnd-kit/react"
import { DotLoader } from "react-spinners"

type SortableProps = {
    id: string | number;
    index: number;
    children: React.ReactNode;
    tabIndex?: number;
}

function PlanPage() {
    const planId = useParams()
    const pointId = Number(planId.id)
    const navigate = useNavigate()

    const generatePres = useMutation({
        mutationFn: async ({ template, pointId }: { template: number, pointId: number }) => {
            return await GeneratePresentationFromPlan(template, pointId)
        },
        onSuccess: (data) => {
            console.log("План создан успешно")
            navigate(`/presentations/${data.presentationId}`)
        },
    })

    const { status, data, error } = useQuery({
        queryKey: ['plans', pointId],
        queryFn: async () => await GetPlan(pointId),
    })

    if (generatePres.isPending || status === 'pending') {
        return <div className={styles.loader}><DotLoader color="#333333" /></div>
    }

    if (generatePres.isError || status === 'error') {
        return <span>Ошибка: {error ? error.message : generatePres.error?.message}</span>
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
                <button className="button-yellow" onClick={() => generatePres.mutate({template: 1, pointId})}>Сгенерировать</button>
            </div>
        </>
    )
}

function ChangePlan(data: Plan) {
    const { control, subscribe, register } = useForm({ defaultValues: { fields: data.plan } })

    const { fields, remove, append, move } = useFieldArray({
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

    const handleDragEnd = (event) => {
        const { source, target } = event.operation

        if (target) {
            move(source.id, target.id)
        }
    }

    useEffect(() => {
        const callback = subscribe({
            formState: {
                values: true,
                isDirty: true
            },
            callback: ({ values, isDirty }) => {
                if (!isDirty) return
                debounceSave(values.fields)
            },
        })

        return () => callback()
    }, [subscribe])

    return (
        <form>
            <DragDropProvider onDragEnd={handleDragEnd}>
                <ul className={styles.planlist}>
                    {fields.map((field, fieldId) => (
                        <Sortable key={fieldId} id={field.id} index={Number(field.id)} tabIndex={fieldId}>
                            <h2 className={styles.h2}>{fieldId + 1}</h2>
                            <div>
                                <div className={styles.flex}>
                                    <input className={styles.slideTitle} {...register(`fields.${fieldId}.title`)} key={field.id} />
                                    <button type="button" className={styles.delete} onClick={() => { remove(fieldId) }} />
                                </div>
                                <ul className={styles.points}>
                                    {field.points?.map((_, pointIndex) => (
                                        <li className={styles.pointitem} key={pointIndex}>
                                            <input {...register(`fields.${fieldId}.points.${pointIndex}`)} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </Sortable>
                    ))}
                </ul>
            </DragDropProvider>
            <button type="button" className={styles.addSlide} onClick={() => { append({ title: "Новый слайд", points: [] }) }}>
                +
            </button>
        </form >
    )
}

function Sortable({ id, index, children, tabIndex }: SortableProps) {
    const { ref } = useSortable({ id, index });

    return (
        <li ref={ref} className={styles.planPoint} tabIndex={tabIndex}>
            {children}
        </li>
    );
}

export default PlanPage