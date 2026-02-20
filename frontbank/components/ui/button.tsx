import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-regular transition-all cursor-pointer disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
	{
		variants: {
			variant: {
				yellow:
					"bg-accent rounded-xl hover:bg-accent_hover active:bg-accent_active",
				white: "bg-accent2 rounded-lg hover:bg-[#F6F7F8] active:bg-[#EAECEE]",
				close: "",
				next: "bg-accent rounded-lg hover:bg-accent_hover disabled:bg-secondary active:bg-accent_active",
			},
			size: {
				yellow: "py-3.5 px-4 min-w-[134px]",
				white: "py-3 px-4",
				close: "",
				next: "size-14",
			},
		},
		defaultVariants: {
			variant: "white",
			size: "white",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";
	size = variant;

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
