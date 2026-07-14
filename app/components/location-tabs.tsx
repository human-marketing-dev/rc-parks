"use client";

import { useState } from "react";
import { locationGroups } from "../content";
import type { Dictionary } from "../dictionaries";

type LocationDict = Dictionary["location"];

export function LocationTabs({ dict }: { dict: LocationDict }) {
  const [active, setActive] = useState(locationGroups[0].id);
  const group =
    locationGroups.find((g) => g.id === active) ?? locationGroups[0];

  const tabLabel = (id: string) =>
    dict.tabs[id as keyof LocationDict["tabs"]] ?? id;
  const itemName = (id: string) =>
    dict.items[id as keyof LocationDict["items"]] ?? id;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-x-[18px] border-b border-stone">
        {locationGroups.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              aria-pressed={isActive}
              className={`cursor-pointer border-b-2 px-1 py-3 text-[15px] transition-colors ${
                isActive
                  ? "border-azure font-medium text-ink"
                  : "border-transparent text-ink/45 hover:text-ink/70"
              }`}
            >
              {tabLabel(tab.id)}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col">
        {group.items.map((item) => {
          const distance = item.km ?? (item.direct ? dict.direct : null);
          return (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-hairline py-[17px]"
            >
              <div className="flex items-center gap-4">
                {item.num ? (
                  <span className="flex size-[30px] flex-none items-center justify-center rounded-full border border-ink text-[12.5px] font-medium tabular-nums">
                    {item.num}
                  </span>
                ) : null}
                <span className="text-[17px] font-medium tracking-[-0.2px]">
                  {itemName(item.id)}
                </span>
              </div>
              {distance ? (
                <span className="whitespace-nowrap text-[16px] font-medium tabular-nums text-azure">
                  {distance}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-[14px]">
        {dict.highlights.map((highlight) => (
          <div
            key={highlight.value}
            className="rounded-[3px] bg-ink px-[26px] py-6 text-white"
          >
            <div className="text-[34px] font-medium tracking-[-1.5px] text-azure">
              {highlight.value}
            </div>
            <div className="mt-1.5 text-sm text-white/70">
              {highlight.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
