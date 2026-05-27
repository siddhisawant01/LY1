import { useEffect, useState } from "react";
import logo from "@/assets/logo.jpg";

export function SplashScreen({ children, duration = 2500 }: { children: React.ReactNode; duration?: number }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [duration]);

  if (show) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background animate-pop-in">
        <img src={logo} alt="Innovine Solutions" className="w-64 md:w-80 animate-float" />
      </div>
    );
  }
  return <>{children}</>;
}
