/* eslint-disable @typescript-eslint/no-explicit-any */
import { downloadfile, getSingleVaultApi } from "@/api/vaults.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle,  } from "@/components/ui/card";
import {
  Calendar,
  Lock,
  Users,
  Clock,
  FileText,
  Image,
  Video,
  Share2
} from "lucide-react";
import ShareCapsuleModal from "./ShareCapsule";

export const GetCapsuleDetails = () => {
  const { vaultId } = useParams<{ vaultId: string }>();
  // const { toast } = useToast();
  const [isShareModalOpen, setIsShareModalOpen] =
    React.useState<boolean>(false);
  const navigate = useNavigate();

  const {
    data: capsule,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vaults", vaultId],
    queryFn: () => getSingleVaultApi(vaultId!),
    enabled: !!vaultId,
    staleTime: 0,
  });

  if (isLoading) {
    return <div className="text-center text-3xl font-bold">Loading...</div>;
  }

  // If capsule is locked, show locked message
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Capsule is Locked
          </h1>
          <Link to="/users/dashboard/capsules">
            <Button
              variant="outline"
              className="border-cosmic-500 text-cosmic-400 hover:bg-cosmic-500/10"
            >
              Back to Capsules
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };



  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Card */}
      <Card className="glass-effect border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white mb-2">
                {capsule.title}
              </CardTitle>
               <p className="text-gray-400">{capsule.content}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsShareModalOpen(true)}
                variant="outline"
                size="sm"
                className="border-cosmic-500 text-cosmic-400 hover:bg-cosmic-500/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Users className="w-5 h-5 text-nebula-400" />
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                Unlocked
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>
                Created:{" "}
                {new Date(capsule.createdAt).toISOString().split("T")[0]}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Unlocked: {capsule.unlockAt}</span>
            </div>
          </CardContent>
        </Card>

        {/* Files Card */}
        <Card className="glass-effect border-white/10 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white">
              Files ({capsule.files?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {capsule.files && capsule.files.length > 0 ? (
                capsule.files.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(file.type)}
                      <div>
                        <p className="text-white text-sm font-medium">
                          {file.fileName}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cosmic-400 hover:bg-cosmic-500/10 cursor-pointer"
                      asChild
                      onClick={() => downloadfile(file.id)}
                    >
                     <span>Download</span>
                      
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm">No files attached.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {capsule.message && capsule.message.length > 0 && (
        <Card className="glass-effect border-white/10">
          <CardHeader>
            <CardTitle className="text-lg text-white">Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{capsule.message}</p>
          </CardContent>
        </Card>
      )}
      <ShareCapsuleModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        capsuleTitle={capsule.title}
        capsuleId={capsule.id}
      />
    </div>
  );
};
