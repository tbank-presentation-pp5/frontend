import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router";
import { PropagateLoader } from "react-spinners";
import { GetPresentation } from "../requests";
import { SLIDE_COMPONENTS } from "./registry";
import { SlideScaler } from "./SlideScaler";
import { ViewerContext } from "./editableFields/ViewerContext";

const SLIDE_W = 1104;
const SLIDE_H = 621;

const NAV_H = 56;

function PresentationViewer() {
    const { id } = useParams();
    const presId = Number(id);
    const [current, setCurrent] = useState(0);
    const touchStartX = useRef(0);

    const { status, data } = useQuery({
        queryKey: ['presentation', presId],
        queryFn: () => GetPresentation(presId),
    });

    const slides: any[] = data?.slides ?? [];
    const total = slides.length;

    const prev = () => setCurrent(c => Math.max(0, c - 1));
    const next = () => setCurrent(c => Math.min(total - 1, c + 1));

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
                e.preventDefault();
                next();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                prev();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [total]);

    if (status === 'pending') {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111' }}>
                <PropagateLoader color="#fff" />
            </div>
        );
    }

    if (status === 'error' || !data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111', color: '#fff' }}>
                Ошибка загрузки
            </div>
        );
    }

    const slide = slides[current];
    const SlideComponent = slide ? SLIDE_COMPONENTS[slide.type]?.[slide.templateSlideId] : null;

    return (
        <ViewerContext.Provider value={true}>
        <div
            style={{ position: 'fixed', inset: 0, background: '#111', display: 'flex', flexDirection: 'column' }}
            onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={e => {
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
            }}
        >
            {/* Slide area fills everything above the nav bar */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '12px 12px 0' }}>
                <div style={{
                    width: `min(calc(100vw - 24px), calc((100vh - ${NAV_H + 24}px) * ${SLIDE_W} / ${SLIDE_H}))`,
                }}>
                    <SlideScaler slideWidth={SLIDE_W} slideHeight={SLIDE_H} allowUpscale>
                        {SlideComponent ? (
                            <SlideComponent
                                slide={slide}
                                createdAt={data.createdAt}
                                isViewer={true}
                            />
                        ) : (
                            <div style={{ width: SLIDE_W, height: SLIDE_H, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222', color: '#fff', fontSize: 24 }}>
                                Слайд не найден
                            </div>
                        )}
                    </SlideScaler>
                </div>
            </div>

            {/* Navigation bar */}
            <div style={{
                height: NAV_H,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                color: '#fff',
                fontFamily: '"Neue Sans Regular", sans-serif',
                fontSize: 14,
            }}>
                <button
                    onClick={prev}
                    disabled={current === 0}
                    style={{
                        background: current === 0 ? '#333' : '#444',
                        color: current === 0 ? '#666' : '#fff',
                        border: 'none',
                        borderRadius: 8,
                        width: 36,
                        height: 36,
                        cursor: current === 0 ? 'default' : 'pointer',
                        fontSize: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >←</button>

                <span style={{ minWidth: 80, textAlign: 'center', color: '#aaa' }}>
                    {current + 1} / {total}
                </span>

                <button
                    onClick={next}
                    disabled={current === total - 1}
                    style={{
                        background: current === total - 1 ? '#333' : '#444',
                        color: current === total - 1 ? '#666' : '#fff',
                        border: 'none',
                        borderRadius: 8,
                        width: 36,
                        height: 36,
                        cursor: current === total - 1 ? 'default' : 'pointer',
                        fontSize: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >→</button>

                <Link
                    to={`/presentations/${presId}`}
                    style={{ marginLeft: 8, color: '#888', textDecoration: 'none', fontSize: 13 }}
                >
                    Выйти
                </Link>
            </div>
        </div>
        </ViewerContext.Provider>
    );
}

export default PresentationViewer;
