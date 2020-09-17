import * as React from "react";
import {BackendService, Ticket} from "./backend";
import {take} from "rxjs/operators";

interface AppProps {
    backend: BackendService;
}

const App = ({backend}: AppProps) => {
    const [tickets, setTickets] = React.useState<Ticket[] | null>(null);

    React.useEffect(() => {
        backend.tickets()
            .pipe(take(1))
            .subscribe(ts => {
                /**
                 * If I don't do the "spread" here, it will cause the array to mutate. This is a limiation of not having
                 * a server-backend. However, I'm determined to treat the "backend" as if it were a server one, so I won't be
                 * fixing this upstream
                 */
                setTickets([...ts]);
            });
    }, []);

    const addTicket = () => {
        backend.newTicket({description: "This is a test"})
            .pipe(take(1))
            .toPromise()
            .then(newTick => {
                setTickets(tix => [...(tix || []), newTick])
            });
    }

    return (
        <div>
            <h2>Tickets</h2>
            {tickets ? (
                <ul>
                    {tickets.map(t => (
                        <li key={t.id}>
                            Ticket: {t.id}, {t.description}
                        </li>
                    ))}
                </ul>
            ) : (
                <span>...</span>
            )}
            <button onClick={() => addTicket()}>Add ticket</button>
        </div>
    );
};

export default App;
