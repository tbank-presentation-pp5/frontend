import { usePage, useActions } from "./useGenerateStore"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Helmet } from "react-helmet"
import './generate.css'
import { useState } from "react"
import Chevron from "react-chevron"

type Inputs = {
    numberOfSlides: number,
    prompt: string
}

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
        <div className="main-container">
            <Helmet>
                <title>Создайте вашу презентацию</title>
            </Helmet>
            <h1>С чего начнем?</h1>
            <a>Сгенерируйте с нуля, загрузите уже существующий файл или вставьте текст своей презентации</a>
            <div className="cards-container">
                <button className="generate-card" onClick={() => setPage('zero')}>
                    <img src="./AI.png" />
                    <h2>Сгенерируйте</h2>
                    <a>Напишите тему презентации, ИИ сделает все остальное</a>
                </button>
                <button className="generate-card" onClick={() => setPage('zero')}>
                    <img src="./upload.png" />
                    <h2>Загрузите файл</h2>
                    <a>Загрузите файл со своей системы или гугл диска</a>
                </button>
                <button className="generate-card" onClick={() => setPage('zero')}>
                    <img src="./write.png" />
                    <h2>Вставьте текст</h2>
                    <a>Файл не открывается? Вставьте его содержание</a>
                </button>
            </div>
        </div>
    )
}

function Zero() {
    const { clearPage } = useActions();
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
        setIsSubmitted(true)
    };

    if (isSubmitted) {
        return <h1>Спасибо за ваш промпт</h1>
    }

    return (
        <div className="main-container">
            <Helmet>
                <title>Создание по промпту</title>
            </Helmet>
            <div className="flex">
                <img src="./AI.png" />
                <h1>Генерируем</h1>
            </div>
            <a>О чем будет ваша презентация?</a>
            <form className="prompt-form" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex">
                    <span>Cлайдов:</span>                
                    <input defaultValue={10} {...register("numberOfSlides")} />
                </div>
                <div className="flex">                
                    <input {...register("prompt", { required: true })} />
                    <button type="submit" className="button-yellow"><Chevron /></button>
                </div>
                {errors.prompt && <span>Это поле обязательно</span>}
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