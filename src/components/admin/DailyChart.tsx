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
      <div className="h-60 rounded-xl flex items-center justify-center bg-[#F7FAF8] border border-dashed border-[#D3DED7] text-[14px] text-[#5B7065]">
        No traffic recorded in this period yet.
      </div>
    );
  }

  const maxViews = Math.max(1, ...data.map((d) => Number(d.page_views || 0)));
  const maxLeads = Math.max(1, ...data.map((d) => Number(d.leads || 0)));

  const width = 800;
  const height = 240;
  const padL = 42;
  const padR = 18;
  const padT = 20;
  const padB = 30;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const stepX = innerW / data.length;
  const barW = Math.max(6, Math.min(28, stepX * 0.56));

  const leadCoords = data.map((d, i) => ({
    x: padL + i * stepX + stepX / 2,
    y: padT + innerH - (Number(d.leads || 0) / maxLeads) * (innerH * 0.85),
  }));

  const leadPolyline = leadCoords.map((p) => `${p.x},${p.y}`).join(" ");
  const activePoint = hovered !== null ? data[hovered] : null;
  const activeCr =
    activePoint && activePoint.sessions > 0
      ? ((activePoint.leads / activePoint.sessions) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
        <div className="flex items-center gap-5 text-[#4B5F55]">
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#147A53]/25 border border-[#147A53] inline-block" />
            <span>Page views</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3.5 h-0.5 bg-[#0F291E] rounded-full inline-block" />
            <span>Leads (right scale)</span>
          </span>
        </div>

        {activePoint ? (
          <div className="rounded-full bg-[#0F291E] text-[#FFFFFF] px-3.5 py-1 text-[12px] font-medium tabular-nums shadow-xs">
            {activePoint.day} · {activePoint.page_views} views · {activePoint.sessions} sessions ·{" "}
            <span className="text-[#7CE5B5] font-semibold">{activePoint.leads} leads</span> (
            {activeCr}%)
          </div>
        ) : (
          <span className="text-[12px] text-[#6E8278]">Hover a day to inspect exact metrics</span>
        )}
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[460px] h-60 select-none"
          role="img"
          aria-label="Daily page views and leads chart"
        >
          <defs>
            <linearGradient id="dashBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#147A53" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#147A53" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="dashBarActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#147A53" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#147A53" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {[0, 0.5, 1].map((pct) => {
            const y = padT + innerH * (1 - pct);
            const label = Math.round(maxViews * pct);
            return (
              <g key={pct}>
                <line
                  x1={padL}
                  y1={y}
                  x2={width - padR}
                  y2={y}
                  stroke="#E7ECE9"
                  strokeDasharray={pct === 0 ? undefined : "4 4"}
                  strokeWidth={1}
                />
                <text x={padL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#73877C">
                  {label}
                </text>
              </g>
            );
          })}

          {/* Rounded Bars */}
          {data.map((d, i) => {
            const x = padL + i * stepX + (stepX - barW) / 2;
            const val = Number(d.page_views || 0);
            const barH = Math.max(2, (val / maxViews) * innerH);
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
                  fill={isActive ? "rgba(20,122,83,0.05)" : "transparent"}
                />
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={Math.min(6, barW / 2)}
                  fill={isActive ? "url(#dashBarActive)" : "url(#dashBarGrad)"}
                />
              </g>
            );
          })}

          {/* Leads Trend Line */}
          {leadCoords.length > 1 && (
            <polyline
              fill="none"
              stroke="#0F291E"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={leadPolyline}
            />
          )}
          {leadCoords.map((pt, i) => {
            const leads = Number(data[i].leads || 0);
            return (
              <circle
                key={`pt-${data[i].day}`}
                cx={pt.x}
                cy={pt.y}
                r={hovered === i ? 5 : 3.25}
                fill={leads > 0 ? "#0F291E" : "#FFFFFF"}
                stroke="#0F291E"
                strokeWidth={1.75}
              />
            );
          })}

          {/* Sparse X-Axis Labels */}
          {data.map((d, i) => {
            const stride = Math.max(1, Math.ceil(data.length / 8));
            if (i % stride !== 0 && i !== data.length - 1) return null;
            const x = padL + i * stepX + stepX / 2;
            return (
              <text
                key={`lbl-${d.day}`}
                x={x}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#73877C"
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
