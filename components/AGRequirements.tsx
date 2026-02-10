"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import type AGRequirementsProps from "@/types/AGRequirementProps";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const agRequirements = {
  a: { name: "History/Social Science", required: 20, recommended: 20 },
  b: { name: "English", required: 40, recommended: 40 },
  c: { name: "Mathematics", required: 30, recommended: 40 },
  d: { name: "Science", required: 20, recommended: 30 },
  e: { name: "Language Other than English", required: 20, recommended: 30 },
  f: { name: "Visual and Performing Arts", required: 10, recommended: 10 },
  g: { name: "College-Preparatory Elective", required: 10, recommended: 10 },
};

export default function AGRequirements({ agCounts }: AGRequirementsProps) {
  const [expanded, setExpanded] = useState(true);
  const [recommended, setRecommended] = useState(true);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>UC A-G Requirements Progress</CardTitle>
        <CardAction onClick={() => setExpanded(!expanded)}>
          {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </CardAction>
      </CardHeader>
      {expanded && (
        <>
          <CardContent className="space-y-4">
            {Object.entries(agRequirements).map(([key, requirement]) => {
              const count = agCounts[key as keyof typeof agCounts];
              let progress = 0;
              if (recommended) {
                progress = Math.min(
                  (count / requirement.recommended) * 100,
                  100,
                );
              } else {
                progress = Math.min((count / requirement.required) * 100, 100);
              }

              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">
                        {key.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {requirement.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {count} /{" "}
                      {recommended
                        ? requirement.recommended
                        : requirement.required}{" "}
                      {recommended ? "recommended" : "required"} credits
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="gap-2">
            <Switch
              id="req-toggle"
              onClick={() => setRecommended(!recommended)}
              checked={recommended}
              className="cursor-pointer"
            />
            <Label htmlFor="req-toggle">Show recommended</Label>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
