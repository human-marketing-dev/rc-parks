"use client";

import { useState } from "react";
import { locationTabs } from "../content";

export function LocationTabs() {
  const [active, setActive] = useState(locationTabs[0].key);
  const items =
    locationTabs.find((tab) => tab.key === active)?.items ??
    locationTabs[0].items;

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-x-[18px] border-b border-stone">
        {locationTabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              aria-pressed={isActive}
              className={`cursor-pointer border-b-2 px-1 py-3 text-[15px] transition-colors ${
                isActive
                  ? "border-azure font-medium text-ink"
                  : "border-transparent text-ink/45 hover:text-ink/70"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-4 border-b border-hairline py-[17px]"
          >
            <div className="flex items-center gap-4">
              {item.num ? (
                <span className="flex size-[30px] flex-none items-center justify-center rounded-full border border-ink text-[12.5px] font-medium tabular-nums">
                  {item.num}
                </span>
              ) : null}
              <span className="text-[17px] font-medium tracking-[-0.2px]">
                {item.name}
              </span>
            </div>
            {item.km ? (
              <span className="whitespace-nowrap text-[16px] font-medium tabular-nums text-azure">
                {item.km}
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-[14px]">
        <div className="rounded-[3px] bg-ink px-[26px] py-6 text-white">
          <div className="text-[34px] font-medium tracking-[-1.5px] text-azure">
            15 min
          </div>
          <div className="mt-1.5 text-sm text-white/70">
            del Aeropuerto Int. del Norte
          </div>
        </div>
        <div className="rounded-[3px] bg-ink px-[26px] py-6 text-white">
          <div className="text-[34px] font-medium tracking-[-1.5px] text-azure">
            20 min
          </div>
          <div className="mt-1.5 text-sm text-white/70">
            del centro de Nuevo León
          </div>
        </div>
      </div>
    </div>
  );
}
