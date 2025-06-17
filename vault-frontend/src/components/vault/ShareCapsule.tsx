import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { get } from 'http';
import { getUsersApi, shareVaultsApi } from '@/api/vaults.api';
import { useToast } from '@/hooks/use-toast';

interface ShareCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsuleTitle: string;
  capsuleId: string;
}

// Mock users data - in a real app this would come from an API

const ShareCapsuleModal = ({ isOpen, onClose, capsuleTitle, capsuleId }: ShareCapsuleModalProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const queryClient = useQueryClient();

  const displayUsers = useQuery({
    queryKey: ['vaults'],
    queryFn: () => getUsersApi(),
  })
  
  const mockUsers = useMemo(() => displayUsers.data || [], [displayUsers.data]);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return mockUsers;
    
    const query = searchQuery.toLowerCase();
    return mockUsers.filter(user => 
      user.email.toLowerCase().includes(query) || 
      user.username.toLowerCase().includes(query)
    );
  }, [searchQuery, mockUsers]);

const shareCapsuleMutation = useMutation({
  mutationKey: ['vaults'],
  mutationFn: async({recipientName, capsuleId}: {recipientName: string, capsuleId: string}) => await shareVaultsApi(capsuleId, recipientName),
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ['vaults']});
    toast({
      title: 'Capsule Shared',
      description: `Capsule ${capsuleTitle} has been shared successfully with ${selectedUser?.username}.`,	
    })

    // Reset form and close modal
    setSelectedUser(null);
    setMessage('');
    setSearchQuery('');
    onClose();
}, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
onError: (error: any) => {
  console.log(error)
  toast({
    title: "Capsule Share Failed",
    description: error?.message || "Please try again later.",
    variant: "destructive",
})}
})

  const handleShare = () => {
    if (!selectedUser) return;
    
    console.log('Sharing capsule:', {
      capsuleTitle,
      recipient: selectedUser,
      message
    });

    shareCapsuleMutation.mutate({recipientName: selectedUser.username, capsuleId})
  };

  const handleUserSelect = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setSearchQuery(''); // Clear search after selection
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Share Capsule</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Search Username
            </label>
            <Input
              placeholder="Type username to search..."
              value={searchQuery}
              name='recipientName'
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-700 border-white/10 text-white placeholder:text-gray-400"
            />
            
            {/* Show selected user if one is selected and no search query */}
            {selectedUser && !searchQuery && (
              <div className="mt-2 p-3 bg-slate-700 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-cosmic-400" />
                    <div>
                      <div className="font-medium text-white">{selectedUser.displayName}</div>
                      <div className="text-sm text-gray-400">@{selectedUser.username}</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-white hover:bg-slate-600"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}

            {/* Show filtered results when typing */}
            {searchQuery && (
              <div className="mt-2 bg-slate-700 border border-white/10 rounded-lg overflow-hidden">
                <Command className="bg-slate-700">
                  <CommandList className="max-h-40">
                    {filteredUsers.length === 0 ? (
                      <CommandEmpty className="text-gray-400 py-4">
                        No users found matching "{searchQuery}".
                      </CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {filteredUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.username}
                            onSelect={() => handleUserSelect(user)}
                            className="text-white hover:bg-slate-600 cursor-pointer"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUser?.id === user.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <div>
                                <div className="font-medium">{user.username}</div>
                                <div className="text-sm text-gray-400">📧{user.email}</div>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Message (Optional)
            </label>
            <Input
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-slate-700 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose} className="border-white/10 text-white hover:bg-white/10">
              Cancel
            </Button>
            <Button 
              onClick={handleShare}
              disabled={!selectedUser}
              className="bg-cosmic-500 hover:bg-cosmic-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Share Capsule
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareCapsuleModal;
