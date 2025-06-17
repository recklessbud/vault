import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  Lock,
  Users,
  Clock,
  ArrowLeft,
  FileText,
  Image,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCapsuleDetails } from "@/components/vault/CapsuleDetails";

const CapsuleDetails = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/users/dashboard/capsules">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Capsules
            </Button>
          </Link>
        </div>
        <GetCapsuleDetails />
      </div>
    </div>
  );
};

export default CapsuleDetails;
