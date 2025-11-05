"use client";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    }
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }

  return (
    <button onClick={toggleTheme} className="p-2 rounded-full border border-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
      {theme === "light" ? <FiMoon size={20}/> : <FiSun size={20}/>}
    </button>
  );
}