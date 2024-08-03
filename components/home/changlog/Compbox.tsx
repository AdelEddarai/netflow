"use client"

import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { BiPulse } from "react-icons/bi";

export function ComboboxDropdownMenu() {

  const [isDeployed, setIsDeployed] = useState(false);

  useEffect(() => {
    // Simulate deployment after 10 seconds
    const deploymentTimeout = setTimeout(() => {
      setIsDeployed(true);
    }, 10000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(deploymentTimeout);
  }, []);

  return (
    <div className="flex w-full flex-col-2 items-start justify-between rounded border px-4 py-1 sm:flex-row sm:items-center">

      <Badge className="mr-4 mt-1" variant={"outline"}>
        <BiPulse />
      </Badge>

      {/* Dot on the left */}
      <div className="flex items-center">
        <div className="relative flex h-3 w-3 mr-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
              isDeployed ? 'bg-green-400' : 'bg-orange-400'
            } opacity-75`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-3 w-3 ${
              isDeployed ? 'bg-green-500' : 'bg-orange-500'
            }`}
          ></span>
        </div>
        <div>
          All status are normal
        </div>
      </div>
    </div>

  )
}