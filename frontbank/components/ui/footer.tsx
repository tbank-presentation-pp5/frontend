import Link from "next/link";

export default function Footer() {
	return (
		<div className="bg-[#292929] h-36 text-accent2 font-normal flex px-4 mt-auto">
			<div className="w-[1104px] flex justify-between mx-auto pt-14 text-sm">
				<div>
					<div className="flex gap-22 mb-4">
						<Link href="/">Главная</Link>
						<Link href="/">Шаблоны</Link>
						<Link href="/">Поддержка</Link>
					</div>
					<a>© 2025</a>
				</div>
				<div>
					<Link href="/profile">Личный кабинет</Link>
				</div>
			</div>
		</div>
	);
}
