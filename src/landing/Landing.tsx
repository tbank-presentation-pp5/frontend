import styles from './landing.module.css'
import { Link } from 'react-router'
import Header from '../ui/header/Header'
import { Helmet } from "react-helmet"
import { useQuery } from '@tanstack/react-query'
import { GetPreviews } from '../requests'
import { useState } from 'react'

const DEFAULT_PAGE_SIZE = 4
const DEFAULT_PAGE_NUMBER = 0

interface LandingCardProps {
  presentationId: number
  name: string
  updatedAt: number
  previewUrls: string[]
}

function LandingPreviewCard({ presentationId, name, updatedAt, previewUrls }: LandingCardProps) {
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
    <Link key={presentationId} className={styles.lastSlideItem} to={`/presentations/${presentationId}`}>
      <div
        className={styles.imgWrap}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {displayUrl && <img src={displayUrl} className={styles.img} alt={name} />}

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
      <p>{name}</p>
      <span className={styles.lastUpdated}>Обновлено: {new Date(updatedAt * 1000).toLocaleString('ru-RU')}</span>
    </Link>
  )
}

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["lastPresentations"],
    queryFn: async () => await GetPreviews(DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE)
  })

  return (
    <>
      <Helmet>
        <title>Конструктор презентаций</title>
      </Helmet>
      <Header />
      <div className={styles.topContainer}>
        <img src='/clock.png' alt='' />
        <div>
          <h1>Создавайте презентации эффективнее</h1>
          <p>Превратите ваши идеи в готовые презентации использующие корпоративный шаблон.<br />Искусственный интеллект анализирует тему или текст вашей презентации и генерирует структурированный текстовый и графический контент, подбирает слайды из крупного шаблона, и создает презентацию которая эффективно донесет информацию до любой аудитории</p>
          <Link to="generate" className='button-yellow'>Создать презентацию</Link>
        </div>
      </div>
      <div className={styles.midContainer}>
        <h1>Последние проекты</h1>
        {isLoading && <p>Загрузка...</p>}
        {!isLoading && !data?.elements?.length && <p>Здесь будут отображаться презентации над которыми вы работали ранее</p>}
        <div className={styles.lastSlides}>
          {data?.elements.map((item) => (
            <LandingPreviewCard
              key={item.presentationId}
              presentationId={item.presentationId}
              name={item.name}
              updatedAt={item.updatedAt}
              previewUrls={item.previewUrls}
            />
          ))}
        </div>
      </div>
      <div className={styles.botContainer}>
        <div>
          <h1>Генерируйте целые презентации с одного предложения</h1>
          <p>Генерация текстового содержания по теме вашей презентации<br />Настройка количества текста на слайдах<br />Генерация изображений с помощью искусственного интеллекта</p>
        </div>
        <div className={styles.landingCard} style={{ backgroundImage: `url(/landing_card_1.png)` }}>
          <h2>Создайте презентацию с нуля</h2>
          <span>Начните новый проект с одной только темы</span>
          <Link to="/generate" className='button-white'>Начать с нуля</Link>
        </div>
        <div className={styles.landingCard} style={{ backgroundImage: `url(/landing_card_2.png)` }}>
          <h2>Начните работу с файла</h2>
          <span>Загрузите текстовый документ или уже готовую презентацию</span>
          <Link to="/generate" className='button-white'>Загрузить файл</Link>
        </div>
        <div>
          <h1>Используйте файл как основу для своей презентации</h1>
          <p>Загрузите документ (DOC, PDF, TXT) или вставьте его текст<br />ИИ анализирует и структурирует контент по слайдам<br />Используйте свои изображения или сгенерируйте их с помощью искусственного интеллекта</p>
        </div>
      </div>
    </>
  )
}

export default App
