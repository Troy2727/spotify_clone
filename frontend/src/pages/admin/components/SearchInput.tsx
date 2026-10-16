import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SearchInputProps = {
	value: string;
	onChange: (value: string) => void;
	label: string;
	placeholder: string;
};

const SearchInput = ({ value, onChange, label, placeholder }: SearchInputProps) => (
	<div className='relative w-full sm:max-w-xs'>
		<Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400' aria-hidden='true' />
		<Input
			type='search'
			aria-label={label}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			className='h-10 border-white/10 bg-white/5 pl-9 placeholder:text-zinc-500 focus-visible:ring-green-500'
		/>
	</div>
);

export default SearchInput;
