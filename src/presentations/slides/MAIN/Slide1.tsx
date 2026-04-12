import { getFields } from "../../slideHelper";

export const Slide1 = ({ slide, createdAt, styles }: any) => {
  const fields = getFields(slide.content);
  return (
    <div className={styles.mainSlide}>
      <img src="/tbank.png" alt="logo" />
      <div className={styles.mainField}>{fields.title?.value}</div>
      <div className={styles.mainCred}>
        <a>Автор презентации: akiraduck</a>
        {new Date(createdAt * 1000).toLocaleString('ru-RU')}
      </div>
    </div>
  );
};