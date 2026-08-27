"use client";
import Image, { StaticImageData } from "next/image";
import React, { SetStateAction } from "react";

export type Role = "worker" | "employer";

export interface RoleItem {
  imgSrc: StaticImageData;
  title: string;
  role: Role;
}
interface ChooseRoleProps {
  roles: RoleItem[];
  onSelection: () => void;
  setSelectedRole: React.Dispatch<SetStateAction<Role>>;
  loading?: boolean;
}

const ChooseRole = ({
  roles,
  onSelection,
  setSelectedRole,
  loading
}: ChooseRoleProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-lienar-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Labour Hub
            </h1>
            <p className="text-gray-500 text-sm">
              Choose your role to get started
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4 mb-8">
            {roles?.map((role, idx) => (
              <label
                key={idx}
                className="flex items-center p-4 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <input
                  type="radio"
                  name="role"
                  value={role.role}
                  onChange={() => setSelectedRole(role.role)}
                  className="w-5 h-5 text-blue-500 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <Image
                    src={role.imgSrc}
                    width={80}
                    height={80}
                    alt={role.title}
                    className="rounded-lg mb-2"
                  />
                  <p className="text-gray-700 font-medium text-sm">
                    {role.title}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Button */}
          <button
            onClick={onSelection}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-2xl transition hover:shadow-lg"
          >
          {loading ? "Please wait..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;
