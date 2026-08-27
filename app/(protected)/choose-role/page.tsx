"use client";

import ChooseRole from "@/components/sections/choose-role";
import recruitor from "@/assets/recruitor.jpg";
import labour from "@/assets/labour.jpg";
import type { Role, RoleItem } from "@/components/sections/choose-role";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roles: RoleItem[] = [
  {
    imgSrc: labour,
    title: "I need work",
    role: "worker",
  },
  {
    imgSrc: recruitor,
    title: "I need workers",
    role: "employer",
  },
];

export default function ChooseRolePage() {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0].role);
  const router = useRouter();

  const handleRoleSelection = () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    router.push(
      selectedRole === "worker" ? "/choose-skills" : "/choose-business",
    );
  };

  return (
    <ChooseRole
      roles={roles}
      onSelection={handleRoleSelection}
      setSelectedRole={setSelectedRole}
    />
  );
}
