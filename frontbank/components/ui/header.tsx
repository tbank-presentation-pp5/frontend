import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@radix-ui/react-navigation-menu";

export default function Header() {
	return (
		<div className="bg-accent2 h-16 flex items-center justify-center">
			<NavigationMenu className="w-[1104px] mx-8">
				<NavigationMenuList className="flex flex-wrap gap-9 text-sm">
					<NavigationMenuItem>
						<NavigationMenuLink href="/">Главная</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href="/dashboard">
							Конструктор
						</NavigationMenuLink>
					</NavigationMenuItem>
					<NavigationMenuItem>
						<NavigationMenuLink href="/support">Поддержка</NavigationMenuLink>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
