import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Schema } from "../App";
import "./Nav.css";

export function Nav({ schemas }: { schemas: Schema[] }) {
  const location = useLocation();
  
  const isActive = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);
  
  return (
    <nav className="nav">
      <Link to="/" className="logo">Welcome</Link>
      <div className="tabs">
        {schemas.map((s) => (
          <Link 
            key={s.id} 
            to={`/dataset/${s.id}`} 
            className={"tab" + (isActive(`/dataset/${s.id}`) ? " active" : "")}
          >
            {String(s.title)}
          </Link>
        ))}

      </div>
    </nav>
  );
}
