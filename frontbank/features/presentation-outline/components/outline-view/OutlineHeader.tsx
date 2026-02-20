interface OutlineHeaderProps {
	title: string;
}

export const OutlineHeader: React.FC<OutlineHeaderProps> = ({ title }) => {
	return <h1 className="pl-7 pt-6 font-bold text-2xl font-tinkoff">{title}</h1>;
};
