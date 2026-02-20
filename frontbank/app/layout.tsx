import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Neue_Sans, Tinkoff_Sans } from "./fonts/fonts";

export const metadata: Metadata = {
	title: "Конструктор презентаций Т-банк",
	description: "Создай свою презентацию по шаблону",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="ru"
			className={`${Tinkoff_Sans.variable} ${Neue_Sans.variable}`}
		>
			<body>
				<main>{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
