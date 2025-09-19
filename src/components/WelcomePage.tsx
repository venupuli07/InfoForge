import { useNavigate } from "react-router-dom";
import { SCHEMAS } from "../schemas";
import "./WelcomePage.css";
import "./WelcomePage.css";

export function WelcomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="welcome">
      <h1>Welcome</h1>
      <p>Select a dataset from the navigation to begin CRUD operations.</p>
      <div className="welcome-grid">
        {SCHEMAS.map((s) => (
          <div key={s.id} className="card" onClick={() => navigate(`/dataset/${s.id}`)}>
            <h3>{s.title}</h3>
            <p>{s.fields.length} fields</p>
          </div>
        ))}
      </div>
    </div>
  );
}
