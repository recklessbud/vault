import React from "react";
import { Calendar, Lock, Users, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GetAllVaults } from "@/components/vault/GetAllVaults";

export const ViewVaults = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/users/dashboard">
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
              <h1 className="text-3xl font-bold text-white">All Capsules</h1>
              <p className="text-gray-400">
                Manage and view all your time capsules
              </p>
            </div>
          </div>
        </div>

        {/* Capsules Grid */}
        <GetAllVaults />
      </div>
    </div>
  );
};
