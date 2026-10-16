import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type ConfirmDeleteDialogProps = {
	name: string;
	description: string;
	onConfirm: () => void;
	triggerClassName?: string;
};

const ConfirmDeleteDialog = ({ name, description, onConfirm, triggerClassName }: ConfirmDeleteDialogProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					aria-label={`Delete ${name}`}
					className={cn("text-zinc-400 hover:bg-red-500/10 hover:text-red-400", triggerClassName)}
				>
					<Trash2 className='size-4' />
				</Button>
			</DialogTrigger>
			<DialogContent className='border-white/10 bg-zinc-900 sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Delete “{name}”?</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>
				<DialogFooter className='gap-2'>
					<Button variant='ghost' onClick={() => setOpen(false)}>
						Cancel
					</Button>
					<Button
						className='bg-red-500 text-white hover:bg-red-600'
						onClick={() => {
							onConfirm();
							setOpen(false);
						}}
					>
						Delete
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmDeleteDialog;
