import React from "react";

interface IconProps {
  className?: string;
}

export function HouseIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9v11h14V9" />
      <path d="M9.5 20v-6h5v6" />
    </svg>
  );
}

export function LandPlotIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="3 7 9 4 15 7 21 4 21 17 15 20 9 17 3 20 3 7" />
      <line x1="9" y1="4" x2="9" y2="17" />
      <line x1="15" y1="7" x2="15" y2="20" />
    </svg>
  );
}

export function ApartmentIcon({ className = "w-7 h-7" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <line x1="8" y1="7" x2="10" y2="7" />
      <line x1="14" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="10" y2="11" />
      <line x1="14" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="10" y2="15" />
      <line x1="14" y1="15" x2="16" y2="15" />
      <path d="M10 21v-3h4v3" />
    </svg>
  );
}

export function LocationCrosshairIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2.5" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
    </svg>
  );
}

export function MicrophoneVoiceIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  );
}

export function CheckMarkIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function PaintRollerIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="14" height="6" rx="1.5" />
      <path d="M17 6h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-6a2 2 0 0 0-2 2v1" />
      <rect x="9.5" y="16" width="3" height="5" rx="1" />
    </svg>
  );
}

export function KitchenCabinetIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="12" y1="10" x2="12" y2="20" />
      <line x1="7" y1="7" x2="9" y2="7" />
      <line x1="15" y1="7" x2="17" y2="7" />
    </svg>
  );
}

export function RoofTrussIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="2 16 12 5 22 16 2 16" />
      <line x1="12" y1="5" x2="12" y2="16" />
      <line x1="7" y1="10.5" x2="12" y2="16" />
      <line x1="17" y1="10.5" x2="12" y2="16" />
    </svg>
  );
}

export function BathroomWaterIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
      <path d="M6 12V6a2 2 0 0 1 4 0v1" />
      <line x1="7" y1="19" x2="6" y2="21" />
      <line x1="17" y1="19" x2="18" y2="21" />
    </svg>
  );
}

export function WindowFrameIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

export function PhoneKeypadIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="9" cy="7" r="0.8" fill="currentColor" />
      <circle cx="12" cy="7" r="0.8" fill="currentColor" />
      <circle cx="15" cy="7" r="0.8" fill="currentColor" />
      <circle cx="9" cy="11" r="0.8" fill="currentColor" />
      <circle cx="12" cy="11" r="0.8" fill="currentColor" />
      <circle cx="15" cy="11" r="0.8" fill="currentColor" />
      <circle cx="9" cy="15" r="0.8" fill="currentColor" />
      <circle cx="12" cy="15" r="0.8" fill="currentColor" />
      <circle cx="15" cy="15" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function ScaleMeasureIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

export function UsersFamilyIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="7" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <circle cx="17" cy="8.5" r="2.5" />
      <path d="M16 14.5a5.5 5.5 0 0 1 5.5 5.5" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3l8 3.5v5.5c0 5-3.4 8.8-8 10-4.6-1.2-8-5-8-10V6.5L12 3z" />
      <polyline points="9 12 11 14 15.5 9.5" />
    </svg>
  );
}
