import saveAs from "file-saver";
import { useState, useRef, useEffect } from "react";
import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import styles from "./exportdropdown.module.css";

type ExportType = "pptx" | "pdf" | "zip" | "gslides";

interface ExportDropdownProps {
    presId: number | string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ presId }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<ExportType | null>(null);

    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const closeMenu = () => {
        setOpen(false);
        buttonRef.current?.focus();
    };

    const googleLogin = useGoogleLogin({
        flow: "implicit",

        scope: "https://www.googleapis.com/auth/drive.file",

        onSuccess: async (tokenResponse: TokenResponse) => {
            try {
                const accessToken = tokenResponse.access_token;

                if (!accessToken) {
                    throw new Error("No access token received from Google");
                }

                const res = await fetch(
                    `/api/v1/presentations/${presId}/google-slides/export`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            oauthAccessToken: accessToken,
                        }),
                    }
                );

                if (!res.ok) {
                    throw new Error(`Export failed: ${res.status}`);
                }

                const data: { url: string } = await res.json();

                window.open(data.url, "_blank", "noopener,noreferrer");
            } catch (err) {
                console.error(err);
                alert("Ошибка экспорта в Google Slides");
                closeMenu();
            } finally {
                setLoading(null);
                closeMenu();
            }
        },

        onError: () => {
            setLoading(null);
            alert("Ошибка Google авторизации");
            closeMenu();
        },
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                open &&
                menuRef.current &&
                !menuRef.current.contains(e.target as Node) &&
                !buttonRef.current?.contains(e.target as Node)
            ) {
                closeMenu();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeMenu();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape as any);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape as any);
        };
    }, [open]);


    const downloadFile = async (
        type: ExportType,
        url: string,
        filename: string
    ) => {
        if (loading !== null) return;

        setLoading(type);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const blob = await res.blob();
            saveAs(blob, filename);
        } catch (err) {
            console.error(`Ошибка экспорта (${type}):`, err);
            alert("Ошибка при экспорте файла");
        } finally {
            setLoading(null);
            closeMenu();
        }
    };

    const handleSelect = (type: ExportType) => {
        if (loading !== null) return;

        switch (type) {
            case "pptx":
                return downloadFile(
                    "pptx",
                    `/api/v1/presentations/${presId}/pptx/download`,
                    "presentation.pptx"
                );

            case "pdf":
                return downloadFile(
                    "pdf",
                    `/api/v1/presentations/${presId}/pdfv2/download`,
                    "presentation.pdf"
                );

            case "zip":
                return downloadFile(
                    "zip",
                    `/api/v1/presentations/${presId}/images-in-zip/download`,
                    "slides.zip"
                );

            case "gslides":
                if (loading !== null) return;

                setLoading("gslides");
                googleLogin();
                return;
        }
    };

    return (
        <div className={styles.exportDropdown}>
            <button
                ref={buttonRef}
                className="button-yellow"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                disabled={loading !== null}
            >
                Экспортировать
            </button>

            {open && (
                <div
                    ref={menuRef}
                    role="menu"
                    tabIndex={-1}
                    className={styles.exportMenu}
                >
                    {[
                        { label: "PPTX", type: "pptx" as const },
                        { label: "PDF", type: "pdf" as const },
                        { label: "Slides ZIP", type: "zip" as const },
                        { label: "Google Slides", type: "gslides" as const },
                    ].map((item) => (
                        <button
                            key={item.type}
                            role="menuitem"
                            disabled={loading !== null}
                            onClick={() => handleSelect(item.type)}
                            className={styles.exportItem}
                        >
                            {loading === item.type
                                ? "Загрузка..."
                                : item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};