import { useState, useEffect } from "react";
import styles from './editable-image.module.css'
import { PropagateLoader } from "react-spinners";

interface PexelsModalProps {
    initialQuery: string;
    onSelect: (pexelsImageId: number) => void;
    onClose: () => void;
}

export const PexelsModal: React.FC<PexelsModalProps> = ({
    initialQuery,
    onSelect,
    onClose
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [debounceQuery, setDebounceQuery] = useState(initialQuery);

    const searchPexels = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                `/api/v1/external-clients/pexels/image?query=${encodeURIComponent(
                    debounceQuery  || 'corporate')}&orientation=square&page=${page}&limit=8`
            );

            const data = await response.json();
            setResults(data.elements);
        } catch (error) {
            console.error('Error searching Pexels:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceQuery(query);
            setPage(1);
        }, 750);

        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        searchPexels();
    }, [debounceQuery, page]);

    return (
        <div className={styles.pexelsModal}>
            <div className={styles.pexelsHeader}>
                <input 
                    placeholder="Поиск"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={onClose} className={styles.pexelsButton}>
                    <img style={{width: "12px", height: "12px"}} src='../close.svg' />
                </button>
            </div>

            {isLoading ? (
                <div className={styles.loader}>
                    <PropagateLoader color="#333333" />
                </div>
            ) : 
            <>
                <div className={styles.pexelsGrid}>
                    {results.map((photo) => (
                        <img
                            key={photo.id}
                            src={photo.url}
                            alt={photo.alt}
                            className={styles.pexelsImage}
                            onClick={() => onSelect(photo.id)}
                        />
                    ))}
                </div>
                <div className={styles.pexelsPagination}>
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className={styles.pexelsButton}
                    >
                        <img src='../arrow.svg' style={{transform: 'rotate(180deg)'}}/>
                    </button>
                    <span>Страница {page}</span>
                    <button 
                        disabled={results.length === 0}
                        onClick={() => setPage((p) => p + 1)}
                        className={styles.pexelsButton}
                    >
                        <img src='../arrow.svg' />
                    </button>
                </div>
            </>}
        </div>
    )
}