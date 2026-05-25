import { useQuery, useMutation } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import { Helmet } from "react-helmet"
import { useFieldArray, useForm } from "react-hook-form"
import { GeneratePresentationFromPlan, GetPlan, UpdatePlan } from "../requests"
import styles from "./planpage.module.css"
import type { Plan, PlanSlide } from "../types"
import { useEffect, useMemo, useRef, useState } from "react"
import { ModelSelector, type ModelSelectorValue } from "../components/ModelSelector"
import debounce from "debounce"
import { DotLoader } from "react-spinners"
import { CSS } from '@dnd-kit/utilities';
import {
    DndContext,
    type DragEndEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove
} from "@dnd-kit/sortable"

type SortableProps = {
    id: string | number;
    index: number;
    children: React.ReactNode;
    tabIndex?: number;
    isDraggingEnabled: boolean;
}

function PlanPage() {
    const planId = useParams()
    const pointId = Number(planId.id)
    const navigate = useNavigate()

    const modelSelectionRef = useRef<ModelSelectorValue>({
        textModel: "",
        imageModel: "",
        modelParams: {},
    })

    const generatePres = useMutation({
        mutationFn: async ({ template, pointId }: { template: number, pointId: number }) => {
            const { textModel, imageModel, modelParams } = modelSelectionRef.current
            return await GeneratePresentationFromPlan(
                template,
                pointId,
                textModel || undefined,
                imageModel || undefined,
                Object.keys(modelParams).length > 0 ? modelParams : undefined,
            )
        },
        onSuccess: (data) => {
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
                <p>Здесь вы можете отредактировать текст каждого слайда и дополнительно настроить свою презентацию</p>
                <div className={styles.planContainer}>
                    <h2>Содержание</h2>
                    <ChangePlan {...data} />
                </div>
            </div>
            <div className={styles.submitButton}>
                <ModelSelector
                    showImageModel={true}
                    onChange={val => { modelSelectionRef.current = val }}
                />
                <button className="button-yellow" onClick={() => generatePres.mutate({ template: 1, pointId })}>
                    Сгенерировать
                </button>
            </div>
        </>
    )
}

function ChangePlan(data: Plan) {
    const { control, subscribe, register } = useForm({ defaultValues: { fields: data.plan } })
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(false)

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8,
            },
        }),
    )

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const oldIndex = fields.findIndex(f => f.id === active.id);
        const newIndex = fields.findIndex(f => f.id === over.id);

        if (oldIndex === newIndex) return;

        const reordered = arrayMove(fields, oldIndex, newIndex);

        move(oldIndex, newIndex);

        const payload: PlanSlide[] = reordered.map((item) => ({
            title: item.title,
            points: item.points,
        }));

        debounceSave(payload);
    };

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
            <button
                type="button"
                className="button-yellow"
                style={{ marginBottom: 16 }}
                onClick={() => setIsDraggingEnabled(prev => !prev)}
            >
                {isDraggingEnabled ? "Редактировать текст" : "Редактировать порядок"}
            </button>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <ul className={styles.planlist}>
                    <SortableContext
                        items={fields.map(f => f.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {fields.map((field, index) => (
                            <Sortable
                                key={field.id}
                                id={field.id}
                                index={index}
                                tabIndex={index}
                                isDraggingEnabled={isDraggingEnabled}
                            >
                                <h2 className={styles.h2}>{index + 1}</h2>
                                <div>
                                    <div className={styles.flex}>
                                        <input
                                            className={styles.slideTitle}
                                            disabled={isDraggingEnabled}
                                            style={{ pointerEvents: isDraggingEnabled ? 'none' : 'auto' }}
                                            {...register(`fields.${index}.title`)}
                                        />
                                        <button type="button" className={styles.delete} onClick={() => { remove(index) }} />
                                    </div>
                                    <ul className={styles.points}>
                                        {field.points?.map((_, pointIndex) => (
                                            <li className={styles.pointitem} key={pointIndex} style={{ pointerEvents: isDraggingEnabled ? 'none' : 'auto' }}>
                                                <input
                                                    disabled={isDraggingEnabled}
                                                    {...register(`fields.${index}.points.${pointIndex}`)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Sortable>
                        ))}
                    </SortableContext>
                </ul>
            </DndContext>
            <button type="button" className={styles.addSlide} onClick={() => { append({ title: "Новый слайд", points: [] }) }}>
                +
            </button>
        </form >
    )
}

function Sortable({ id, children, isDraggingEnabled }: SortableProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id, disabled: !isDraggingEnabled });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <li
            ref={setNodeRef}
            className={styles.planPoint}
            style={style}
            {...attributes}
            {...(isDraggingEnabled ? listeners : {})}
        >
            {children}
        </li>
    );
}

export default PlanPage