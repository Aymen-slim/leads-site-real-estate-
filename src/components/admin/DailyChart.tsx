"use client";

import React, { useState } from "react";

export interface DailyPoint {
  day: string;
  page_views: number;
  sessions: number;
  leads: number;
}

export function DailyChart({ data }: { data: DailyPoint[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex items-center justify-center bg-[#F7F7F7] border border-[#DFDFDF] text-[15px] text-[#5A5954]">
        No traffic recorded in this period yet.
      </div>
    );
  }

  const maxViews = Math.max(1, ...data.map((d) => Number(d.page_views || 0)));
  const maxLeads = Math.max(1, ...data.map((d) => Number(d.leads || 0)));

  const width = 760;
  const height = 220;
  const padL = 40;
  const padR = 16;
  const padT = 18;
  const padB = 28;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const stepX = innerW / data.length;
  const barW = Math.max(4, Math.min(28, stepX * 0.58));

  const leadPoints = data
    .map((d, i) => {
      const x = padL + i * stepX + stepX / 2;
      const y = padT + innerH - (Number(d.leads || 0) / maxLeads) * (innerH * 0.85);
      return `${x},${y}`;
    })
    .join(" ");

  const activePoint = hovered !== null ? data[hovered] : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#292823]">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#B8C49E] border border-[#5D726A] inline-block" />
            <span>Page views</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-[#292823] inline-block" />
            <span>Leads (right scale)</span>
          </span>
        </div>

        {activePoint ? (
          <div className="bg-[#EDF0E7] border border-[#5D726A] px-3 py-1 tabular-nums font-medium text-[#000000]">
            {activePoint.day}: {activePoint.page_views} views · {activePoint.sessions} sessions ·{" "}
            {activePoint.leads} leads
          </div>
        ) : (
          <span className="text-[#5A5954]">Hover a bar to inspect day details</span>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[460px] h-56 select-none"
          role="img"
          aria-label="Daily page views and leads chart"
        >
          {/* Horizontal grid lines */}
          {[0, 0.5, 1].map((pct) => {
            const y = padT + innerH * (1 - pct);
            const label = Math.round(maxViews * pct);
            return (
              <g key={pct}>
                <line x1={padL} y1={y} x2={width - padR} y2={y} stroke="#DFDFDF" strokeWidth={1} />
                <text
                  x={padL - 6}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#5A5954"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const x = padL + i * stepX + (stepX - barW) / 2;
            const val = Number(d.page_views || 0);
            const barH = (val / maxViews) * innerH;
            const y = padT + innerH - barH;
            const isActive = hovered === i;
            return (
              <g
                key={d.day}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <rect
                  x={padL + i * stepX}
                  y={padT}
                  width={stepX}
                  height={innerH}
                  fill="transparent"
                />
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(1, barH)}
                  fill={isActive ? "#5D726A" : "#B8C49E"}
                  stroke="#5D726A"
                  strokeWidth={isActive ? 1.5 : 0.75}
                />
              </g>
            );
          })}

          {/* Leads line */}
          {data.length > 1 && (
            <polyline
              fill="none"
              stroke="#292823"
              strokeWidth={2}
              points={leadPoints}
            />
          )}
          {data.map((d, i) => {
            const x = padL + i * stepX + stepX / 2;
            const y = padT + innerH - (Number(d.leads || 0) / maxLeads) * (innerH * 0.85);
            return (
              <circle
                key={`pt-${d.day}`}
                cx={x}
                cy={y}
                r={hovered === i ? 4.5 : 3}
                fill={Number(d.leads || 0) > 0 ? "#292823" : "#FFFFFF"}
                stroke="#292823"
                strokeWidth={1.5}
              />
            );
          })}

          {/* Sparse X axis labels */}
          {data.map((d, i) => {
            const stride = Math.max(1, Math.ceil(data.length / 7));
            if (i % stride !== 0 && i !== data.length - 1) return null;
            const x = padL + i * stepX + stepX / 2;
            return (
              <text
                key={`lbl-${d.day}`}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fontSize="11"
                fill="#5A5954"
              >
                {d.day.slice(5)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
