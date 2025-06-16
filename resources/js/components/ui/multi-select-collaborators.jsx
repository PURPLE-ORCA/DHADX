import React, { useState, useEffect } from 'react';
import { CheckIcon, X, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

export function MultiSelectCollaborators({ collaborators, selected, onSelectChange }) {
    const [open, setOpen] = useState(false);
    const [selectedCollaborators, setSelectedCollaborators] = useState(selected || []);

    useEffect(() => {
        setSelectedCollaborators(selected || []);
    }, [selected]);

    const handleSelect = (collaboratorId) => {
        const newSelection = selectedCollaborators.includes(collaboratorId)
            ? selectedCollaborators.filter((id) => id !== collaboratorId)
            : [...selectedCollaborators, collaboratorId];
        setSelectedCollaborators(newSelection);
        onSelectChange(newSelection);
    };

    const handleRemove = (collaboratorId) => {
        const newSelection = selectedCollaborators.filter((id) => id !== collaboratorId);
        setSelectedCollaborators(newSelection);
        onSelectChange(newSelection);
    };

    const displayValue = selectedCollaborators
        .map((id) => collaborators.find((c) => c.id === parseInt(id))?.name)
        .filter(Boolean)
        .join(', ');

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-[40px] flex-wrap"
                >
                    {selectedCollaborators.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {selectedCollaborators.map((id) => {
                                const collaborator = collaborators.find((c) => c.id === parseInt(id));
                                return collaborator ? (
                                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                                        {collaborator.name}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(id);
                                            }}
                                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ) : null;
                            })}
                        </div>
                    ) : (
                        'Select collaborators...'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput placeholder="Search collaborators..." />
                    <CommandEmpty>No collaborator found.</CommandEmpty>
                    <CommandGroup>
                        {collaborators.map((collaborator) => (
                            <CommandItem
                                key={collaborator.id}
                                value={collaborator.name}
                                onSelect={() => handleSelect(collaborator.id.toString())}
                            >
                                <CheckIcon
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedCollaborators.includes(collaborator.id.toString())
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                                {collaborator.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
