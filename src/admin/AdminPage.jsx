import "../common/App.css";
import "../common/Root.css";
import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div className="about-us">
      <Link className="button" to="/adminusers">
        Administrar users
      </Link>
      <Link className="button" to="/admingames">
        Administrar games
      </Link>
      <Link className="button" to="/adminplayers">
        Administrar players
      </Link>
    </div>
  );
}
