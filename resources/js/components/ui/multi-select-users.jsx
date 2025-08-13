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

export function MultiSelectUsers({ users, selected, onSelectChange }) {
    const [open, setOpen] = useState(false);
    const [selectedCollaborators, setSelectedCollaborators] = useState(selected || []);

    useEffect(() => {
        setSelectedCollaborators(selected || []);
    }, [selected]);

    const handleSelect = (userId) => {
        const newSelection = selectedUsers.includes(userId)
            ? selectedUsers.filter((id) => id !== userId)
            : [...selectedUsers, userId];
        setSelectedUsers(newSelection);
        onSelectChange(newSelection);
    };

    const handleRemove = (userId) => {
        const newSelection = selectedUsers.filter((id) => id !== userId);
        setSelectedUsers(newSelection);
        onSelectChange(newSelection);
    };

    const displayValue = selectedUsers
        .map((id) => users.find((u) => u.id === parseInt(id))?.name)
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
                            {selectedUsers.map((id) => {
                                const user = users.find((u) => u.id === parseInt(id));
                                return user ? (
                                    <Badge key={id} variant="secondary" className="flex items-center gap-1">
                                        {user.name}
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
                        'Select users...'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                        {users.map((user) => (
                            <CommandItem
                                key={user.id}
                                value={user.name}
                                onSelect={() => handleSelect(user.id.toString())}
                            >
                                <CheckIcon
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        selectedUsers.includes(user.id.toString())
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                    )}
                                />
                                {user.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
