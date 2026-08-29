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
    <div className="min-h-screen bg-background px-5 py-10 sm:flex sm:items-center sm:justify-center sm:bg-secondary">
      <div className="mx-auto w-full max-w-md">
        <div className="text-left mb-8">
          <h1 className="text-2xl font-extrabold text-foreground mb-1.5">
            How will you use ApnaKaam?
          </h1>
          <p className="text-muted-foreground text-sm">
            You can change this later in your profile.
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4 mb-8">
          {roles?.map((role, idx) => (
            <label
              key={idx}
              className="group has-checked:border-primary has-checked:bg-accent flex items-center gap-4 rounded-2xl border-2 border-border p-4 cursor-pointer transition"
            >
              <input
                type="radio"
                name="role"
                value={role.role}
                onChange={() => setSelectedRole(role.role)}
                defaultChecked={idx === 0}
                className="sr-only"
              />
              <Image
                src={role.imgSrc}
                width={48}
                height={48}
                alt={role.title}
                className="size-12 shrink-0 rounded-xl object-cover"
              />
              <p className="flex-1 text-foreground font-semibold">
                {role.title}
              </p>
              <span className="group-has-checked:bg-primary group-has-checked:border-primary flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-border text-primary-foreground">
                <svg
                  className="hidden size-3.5 group-has-checked:block"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            </label>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={onSelection}
          className="flex h-14 w-full items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground transition hover:bg-primary/90"
        >
          {loading ? "Please wait..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;
