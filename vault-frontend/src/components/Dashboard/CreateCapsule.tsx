/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVaultApi } from "@/api/vaults.api";

const createCapsuleSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  content: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Content must be less than 300 characters"),
  message: z.string().optional(),
  unlockAt: z.date({ required_error: "Unlock date is required" }),
  files: z.any().optional(),
});

type CreateCapsuleForm = z.infer<typeof createCapsuleSchema>;

interface CreateCapsuleModalProps {
  children: React.ReactNode;
}

const CreateCapsuleModal = ({ children }: CreateCapsuleModalProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateCapsuleForm>({
    resolver: zodResolver(createCapsuleSchema),
    defaultValues: {
      title: "",
      content: "",
      unlockAt: undefined,
      message: "",
      files: undefined,
    },
  });

  const createVaultMutation = useMutation({
    mutationFn: async (data: CreateCapsuleForm) => {
      // If files are present, use FormData for multipart upload
      if (data.files && data.files.length > 0) {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("unlockAt", data.unlockAt.toISOString());
        formData.append("message", data.message || "");
        Array.from(data.files).forEach((file: File, idx: number) => {
          formData.append("files", file); // backend should accept array of files under 'files'
        });
        return createVaultApi(formData, true); // pass true to indicate FormData
      }
      // Otherwise, send JSON
      return createVaultApi({
        title: data.title,
        content: data.content,
        unlockAt: data.unlockAt,
        message: data.message,
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Capsule Created!",
        description: `"${
          form.getValues().title
        }" has been created and will unlock on ${format(
          form.getValues().unlockAt,
          "PPP"
        )}. wait for it`,
      });
      form.reset()
      //setOpen(false);
      // Invalidate the vaults query to force a refetch and show the new capsule immediately
      queryClient.setQueryData(["vaults"], (old: any) => [data, ...(old || [])]);
      queryClient.invalidateQueries({ queryKey: ["vaults"] });
      // setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Capsule Creation Failed",
        description: error?.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateCapsuleForm) => {
    createVaultMutation.mutate(data);     
     setOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      form.setValue("files", files);
    }

  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] glass-effect border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-cosmic-400 to-nebula-400 bg-clip-text text-transparent">
            Create New Time Capsule
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Preserve your memories for the future. Fill in the details below to
            create your time capsule.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Give your capsule a meaningful title..."
                      className="bg-white/5 border-white/20 focus:border-cosmic-500 text-white placeholder:text-gray-400"
                      {...field}
                      required
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
                  <FormLabel className="text-gray-200">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of what this capsule contains..."
                      className="bg-white/5 border-white/20 focus:border-cosmic-500 text-white placeholder:text-gray-400 min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-200">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your thoughts, memories, or messages for the future..."
                      className="bg-white/5 border-white/20 focus:border-cosmic-500 text-white placeholder:text-gray-400 min-h-[100px]"
                      {...field}
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
                        onChange={handleFileChange}
                        className="bg-white/5 border-white/20 focus:border-cosmic-500 text-white file:bg-cosmic-500/20 file:text-cosmic-300 file:border-0 file:rounded-md file:px-3 file:py-1"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unlockAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-200">Unlock Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal bg-white/5 border-white/20 hover:bg-white/10 hover:border-cosmic-500",
                            !field.value && "text-gray-400"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>
                              Pick a date when this capsule should unlock
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 glass-effect border-white/20"
                      align="start"
                    >
                      <Calendar
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

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cosmic-500 to-cosmic-600 hover:from-cosmic-600 hover:to-cosmic-700 text-white"
              >
                Create Capsule
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCapsuleModal;
