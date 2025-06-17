/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVaultApi, getVault } from "@/api/vaults.api";
import {
  Calendar,
  Lock,
  Users,
  Clock,
  ArrowLeft,
  Trash2,
  Edit,
  Unlock,
  Vault
} from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import EditCapsuleForm from "./UpdateCapsule";

export const GetAllVaults = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = React.useState(1);
  // const location = useLocation();

  const [editingCapsule, setEditingCapsule] = React.useState<any>(null);

  const handleEdit = (capsule: any) => {
    setEditingCapsule(capsule);
  };

  const handleCloseEdit = () => {
    setEditingCapsule(null);
  };

  const queryData = useQuery({
    queryKey: ["vaults"],
    queryFn: () => getVault(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const vaultData = Array.isArray(queryData.data) ? queryData.data :[];
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async ({ capsuleId }: { capsuleId: string }) => {
      return deleteVaultApi(capsuleId);
    },
    onMutate: async ({ capsuleId }) => {
      await queryClient.cancelQueries({ queryKey: ["vaults"] });
      const previousVaults = queryClient.getQueryData(["vaults"]);
      queryClient.setQueryData(["vaults"], (oldData: any) => {
        if (!oldData) return [];
        return oldData.filter((capsule: any) => capsule.id !== capsuleId);
      });
      return { previousVaults };
    },
    onError: (error: any, _variables, context: any) => {
      toast({
        title: "Capsule Deletion Failed",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
      // Rollback cache if error
      if (context?.previousVaults) {
        queryClient.setQueryData(["vaults"], context.previousVaults);
      }
    },
    onSuccess: (_data, variables: any) => {
      toast({
        title: "Capsule Deleted",
        description: `"${variables.capsuleTitle}" has been permanently deleted.`,
        variant: "destructive",
      });
      // Optionally, you can still invalidate to refetch from server
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
    },
  });

  const handleDelete = (capsuleId: string, capsuleTitle: any) => {
    deleteMutation.mutate({capsuleId, capsuleTitle});

    // In a real app, this would call an API to delete the capsule
    console.log("Delete capsule:", capsuleId);
  };
    const capsulesPerPage = 6;

  const totalPages = Math.ceil(vaultData.length / capsulesPerPage);
  const startIndex = (currentPage - 1) * capsulesPerPage;
  const endIndex = startIndex + capsulesPerPage;
  const currentCapsules = vaultData.slice(startIndex, endIndex);

  const truncateText = (text: string, wordCount: number): string => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordCount) {
      return text;
    }
    return words.slice(0, wordCount).join(" ") + "...";
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
    if (queryData.isLoading) {
    return (
      <div className="text-center py-12 text-gray-400">
        Loading shared capsules...
      </div>
    );
  }

  return (
    <div>
      {/* Empty State */}
      {currentCapsules.length === 0 ? (
        <div className="text-center py-12">
          <Vault className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No capsules yet
          </h3>
          <p className="text-gray-500">
            When you create capsules, they'll appear here👍.
          </p>
         
        </div>
      ) : (
      <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentCapsules.map((capsule) => (
        <div
          key={capsule.id}
          className="glass-effect rounded-lg p-6 border border-white/10 hover:border-cosmic-500/50 transition-all duration-300"
        >
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="font-semibold text-white text-lg">
              {capsule.title}
            </h3>
            {capsule.type === "shared" && (
              <Users className="w-4 h-4 text-nebula-400" />
            )}
            {capsule.daysLeft === 0 ? (
              <Unlock className="w-3 h-3 md:w-4 md:h-4 text-green-400 flex-shrink-0" />
            ) : (
              <Lock className="w-3 h-3 md:w-4 md:h-4 text-cosmic-400 flex-shrink-0" />
            )}
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3">
            {truncateText(capsule.content, 10)}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Unlocks {capsule.unlockAt}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{capsule.daysLeft} days left</span>
            </div>
            {/* {capsule.collaborators > 1 && (
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{capsule.collaborators} collaborators</span>
                  </div>
                )} */}
          </div>

          <div className="flex items-center justify-between">
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                capsule.daysLeft == 0
                  ? "bg-green-500/20 text-green-400"
                  : "bg-cosmic-500/20 text-cosmic-400"
              }`}
            >
              {capsule.daysLeft == 0 ? "Unlocked" : "Locked"}
            </div>
            <Link to={`/users/dashboard/capsules/${capsule.id}/details`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-cosmic-400 hover:bg-cosmic-500/10"
              >
                View Details
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:bg-blue-500/10"
              onClick={() => handleEdit(capsule)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-800 border-slate-700">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">
                    Delete Capsule
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Are you sure you want to delete "{capsule.title}"? This
                    action cannot be undone and all associated files will be
                    permanently lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(capsule.id, capsule.title)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Permanently
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
                  {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mb-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "text-white hover:bg-white/10"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page);
                    }}
                    isActive={currentPage === page}
                    className={currentPage === page 
                      ? "bg-cosmic-500 text-white border-cosmic-500" 
                      : "text-white hover:bg-white/10"
                    }
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "text-white hover:bg-white/10"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        </div>
      ))}
      {editingCapsule && (
        <EditCapsuleForm
          capsule={editingCapsule}
          isOpen={!!editingCapsule}
          onClose={handleCloseEdit}
        />
      )}
    </div>
    </>
  )}
  </div>
)};
