import React from "react";
import Preloader from "@/components/motion/Preloader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Preloader />
      {children}
    </>
  );
}

