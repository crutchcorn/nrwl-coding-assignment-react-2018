import React, { useEffect, useState } from "react";
import { BackendService } from "./backend";

interface AppProps {
  backend: BackendService;
}

const App = ({ backend }: AppProps) => {
  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    const sub = backend.tickets().subscribe(ts => {
      setTickets(ts);
    });
    return () => sub.unsubscribe();
  }, []);

  return (
    <div>
      <h2>Tickets</h2>
      {tickets ? (
        <ul>
          {tickets.map(t => (
            <li>
              Ticket: {t.id}, {t.description}
            </li>
          ))}
        </ul>
      ) : (
        <span>...</span>
      )}
    </div>
  );
};

export default App;
