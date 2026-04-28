import { Slide, Box } from 'spectacle';
import { getFields } from "./slideHelper";
import styles from "./presentation.module.css";

export const Slide1 = ({ slide, createdAt, isViewer }: any) => {
  const f = getFields(slide.content);
  const Wrapper = isViewer ? Slide : 'div';
  return (
    <Wrapper padding={0} >
      <Box className={styles.mainSlide}>
        <img src="/tbank.png" alt="logo" />
        <Box className={styles.mainField}>{f.title?.value}</Box>
        <Box className={styles.mainCred}>
          <a>Автор: akiraduck</a>
          {new Date(createdAt * 1000).toLocaleString('ru-RU')}
        </Box>
      </Box>
    </Wrapper>
  );
};

export const Slide3 = ({ slide, isViewer }: any) => {
  const f = getFields(slide.content);
  const Wrapper = isViewer ? Slide : 'div';
  return (
    <Wrapper padding={0}>
      <Box className={styles.imageSlide}>
        <Box className={styles.imageTitle}>{f.title?.value}</Box>
        <Box className={styles.textContainer}>
          <Box className={styles.textContent}>{f.text?.value}</Box>
          {f.image?.image?.url && <img src={f.image.image.url} alt="img" />}
        </Box>
        {slide.isNeedPageNumber && <Box className={styles.pageNumber}>{slide.orderNumber}</Box>}
      </Box>
    </Wrapper>
  );
};

export const Slide4 = ({ slide, isViewer }: any) => {
  const f = getFields(slide.content);
  const Wrapper = isViewer ? Slide : 'div';
  return (
    <Wrapper padding={0}>
      <Box className={styles.sectionSlide}>
        <Box className={styles.prosConsLeft}><h1>{f.title?.value}</h1></Box>
        <Box className={styles.prosConsRight}>
          <Box>
            <Box className={styles.prosConsIcon}><img src="/pros.png" /> {f.pros_title?.value}</Box>
            <Box className={styles.prosConsText}>{f.pros_text?.value}</Box>
          </Box>
          <Box>
            <Box className={styles.prosConsIcon}><img src="/cons.png" /> {f.cons_title?.value}</Box>
            <Box className={styles.prosConsText}>{f.cons_text?.value}</Box>
          </Box>
        </Box>
        {slide.isNeedPageNumber && <Box className={styles.pageNumberPros}>{slide.orderNumber}</Box>}
      </Box>
    </Wrapper>
  );
};

export const Slide5 = ({ slide, isViewer }: any) => {
  const f = getFields(slide.content);
  const Wrapper = isViewer ? Slide : 'div';
  return (
    <Wrapper padding={0}>
      <Box className={styles.gridSlide}>
        <Box className={styles.imageGrid}>
          {[1, 2, 3, 4, 5].map(n => (
            f[`image_${n}`]?.image?.url && <img key={n} src={f[`image_${n}`].image.url} />
          ))}
        </Box>
        {slide.isNeedPageNumber && <Box className={styles.pageNumber}>{slide.orderNumber}</Box>}
      </Box>
    </Wrapper>
  );
};

export const Slide6 = ({ slide, isViewer }: any) => {
  const f = getFields(slide.content);
  const Wrapper = isViewer ? Slide : 'div';
  return (
    <Wrapper padding={0}>
      <Box className={styles.chartSlide}>
        <h1>{f.title?.value}</h1>
        <Box className={styles.chartLayout}>
          <Box className={styles.chartDescription}>{f.text?.value}</Box>
          <Box className={styles.chartContainer}>
             {/* Сюда вставь свою либу для графиков, используя f.chart.value.data */}
             <pre style={{fontSize: '10px'}}>{JSON.stringify(f.chart?.value?.data, null, 2)}</pre>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
};

export const Slide7 = ({ slide, isViewer }: any) => {
  const f = getFields(slide.content);
  const Wrapper = isViewer ? Slide : 'div';
  return (
    <Wrapper padding={0}>
      <Box className={styles.sixPoints}>
        <h1>{f.title?.value}</h1>
        <Box className={styles.sixPointsGrid}>
          {[1, 2, 3, 4, 5, 6].map(num => (
            f[`point_${num}_subtitle`] && (
              <Box key={num} className={styles.pointItem}>
                <h2 className={styles.pointSubtitle}>{f[`point_${num}_subtitle`].value}</h2>
                <p className={styles.pointText}>{f[`point_${num}_text`]?.value}</p>
              </Box>
            )
          ))}
        </Box>
        {slide.isNeedPageNumber && <Box className={styles.pageNumber}>{slide.orderNumber}</Box>}
      </Box>
    </Wrapper>
  );
};