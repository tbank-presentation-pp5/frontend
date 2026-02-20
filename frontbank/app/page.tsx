import Header from "@/components/ui/header";
import { Card } from "@/components/landing/main-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "@/components/ui/footer";

export default function Home() {
	return (
		<div>
			<Header />
			<main className="h-max py-16 flex flex-col justify-center items-center gap-16 mx-auto">
				<div className="flex flex-col gap-10">
					<div className="text-center">
						<h1 className="text-h1 mb-6">Конструктор презентаций</h1>
						<a>Моментально создавайте презентации с помощью ии</a>
					</div>
					<div className="flex flex-wrap gap-12">
						<Card variant="leftCard" />
						<Card variant="rightCard" />
					</div>
				</div>
				<div className="flex flex-col gap-10 items-center">
					<div className="text-center">
						<h1 className="text-h1 mb-6">Последние проекты</h1>
						<a>
							Здесь будут отображаться презентации над которыми вы работали
							ранее
						</a>
					</div>
					<Link href="/signin">
						<Button variant="yellow">Войти</Button>
					</Link>
				</div>
				<div className="flex flex-col gap-10 items-center">
					<div className="text-center">
						<h1 className="text-h1 mb-6">Готовые шаблоны</h1>
						<a>Начните работу с выбора шаблона</a>
					</div>
					<Link href="/all-templates">
						<Button variant="yellow">Все шаблоны</Button>
					</Link>
				</div>
			</main>
			<Footer />
		</div>
	);
}
