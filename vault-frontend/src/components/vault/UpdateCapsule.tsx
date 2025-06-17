import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Users, FileText, Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVaultApi } from "@/api/vaults.api";
import { useParams } from "react-router-dom";
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Description is required"),
  unlockAt: z.date({
    required_error: "Unlock date is required",
  }),
  files: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditCapsuleFormProps {
  capsule: {
    id: string;
    title: string;
    content: string;
    unlockAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const EditCapsuleForm = ({
  capsule,
  isOpen,
  onClose,
}: EditCapsuleFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { vaultId } = useParams<{ vaultId: string }>();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: capsule.title,
      content: capsule.content,
      unlockAt: new Date(capsule.unlockAt),
      files: undefined, // No initial files
    },
  });

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // If files are present, use FormData for multipart upload
      if (data.files && data.files.length > 0) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("unlockAt", data.unlockAt.toISOString());
        Array.from(data.files).forEach((file: File, idx: number) => {
          formData.append("files", file); // backend should accept array of files under 'files'
        });
        return updateVaultApi(capsule.id, formData, true); // pass true to indicate FormData
      }
      // Otherwise, send JSON
      return updateVaultApi(capsule.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      toast({
        title: "Capsule Updated",
        description: `"${capsule.title}" has been successfully updated with ${selectedFiles.length} files.`,
      });
      setIsSubmitting(false);
      setSelectedFiles([]);
      onClose();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast({
        title: "Capsule Update Failed",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };


 
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  const handleClose = () => {
    form.reset();
    setSelectedFiles([]);
    onClose();
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    data.files = selectedFiles;
    // Simulate API call
    // console.log(vaultId)
    updateMutation.mutate(data);
  };


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Edit Time Capsule
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            aria-disabled={isSubmitting}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                      placeholder="Enter capsule title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                      placeholder="Enter capsule description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

                        <FormField
              control={form.control}
              name="files"
              render={() => (
                <FormItem>
                  <FormLabel className="text-gray-200">
                    Files (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="bg-white/5 border-white/20 focus:border-cosmic-500 text-white file:bg-cosmic-500/20 file:text-cosmic-300 file:border-0 file:rounded-md file:px-3 file:py-1"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">
                  Selected Files ({selectedFiles.length})
                </p>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-slate-700 rounded border border-slate-600"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <File className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:bg-red-500/10 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="unlockAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-300">Unlock Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                            !field.value && "text-gray-400"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Select date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-cosmic-500 hover:bg-cosmic-600"
              >
                {isSubmitting ? "Updating..." : "Update Capsule"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCapsuleForm;

{
  /*  <FormField
              control={form.control}
              name="files"
              render={()=>(
                <FormItem>
                    <div className="space-y-4">
              <FormLabel className="text-gray-300">Add Files</FormLabel>
              
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                  isDragOver
                    ? "border-cosmic-500 bg-cosmic-500/10"
                    : "border-slate-600 hover:border-slate-500"
                )}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  id="file-upload"
                  name="files"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Select Files
                </Button>
              </div>
            </div>
                </FormItem>
              )}
            />*/
}
