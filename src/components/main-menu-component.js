"use client"; // Required when using hooks in Next.js 13+

import { useRouter } from "next/navigation";
import React from "react";

import { Home, User, Settings, Bell, MessageSquare, Star, Camera, Globe, Heart, Music, Video, Sun } from "lucide-react";
import "../styles/main-menu-component.css"; // Import CSS file


const icons = [
  { name: "หวยไทย", icon: Home, route: "/thai-lotto"},
  { name: "หวยลาว", icon: User, route: "/lao-lotto" },
  { name: "หวยฮานอย", icon: Settings, route: "/hanoi-lotto" },
  { name: "หวยเวียดนาม", icon: Bell, route: "/vietnam-lotto" },
];

export default function IconMenu() {
  const router = useRouter();

  return (
    <div className="icon-menu-container">
      <div className="icon-menu-grid">
        {icons.map(({ name, icon: Icon, route }, index) => (
          <button key={index} className="icon-menu-button"  onClick={() => router.push(route)}>
            <Icon size={52} className="icon-menu-icon" />
            <span className="icon-menu-text">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
