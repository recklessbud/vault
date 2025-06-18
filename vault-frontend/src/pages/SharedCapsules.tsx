import React from "react";
import { Calendar, Lock, Users, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GetSharedVaults } from "@/components/vault/GetSharedVaults";

// Filter only shared capsules from the mock data

const SharedCapsules = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/users/dashboard/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Share2 className="w-8 h-8 mr-3 text-cosmic-400" />
                Shared Capsules
              </h1>
              <p className="text-gray-400">
                Capsules that have been shared with you
              </p>
            </div>
          </div>
        </div>

        <GetSharedVaults />
      </div>
    </div>
  );
};

export default SharedCapsules;
