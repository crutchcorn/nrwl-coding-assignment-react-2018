import * as React from 'react';
import {BackendService} from "~backend";
import {useTicketData} from "~constants/ticket-data-context";
import {take} from "rxjs/operators";
import {
    Link
} from "react-router-dom";

interface TicketsListProps {
    backend: BackendService;
}

export const TicketsList = ({backend}: TicketsListProps) => {
    const {state, dispatch} = useTicketData();

    const [err, setErr] = React.useState('');

    const addTicket = () => {
        dispatch({type: 'loadingAction'});
        backend.newTicket({description: "This is a test"})
            .pipe(take(1))
            .toPromise()
            .then(newTick => {
                dispatch({type: 'addTicket', payload: newTick});
            })
            .catch(() => setErr('There was an issue getting your tickets'));
    }

    if (err.length) return <p>{err}</p>

    return (
        <div>
            <h2>Tickets</h2>
            {state.loading && <p aria-live='polite'>Loading...</p>}
            {state.tickets &&
                <ul>
                    {state.tickets.map(t => (
                        <li key={t.id}>
                            <Link to={`/${t.id}`}>
                                Ticket: {t.id}, {t.description}
                            </Link>
                        </li>
                    ))}
                </ul>
            }
            <button onClick={() => addTicket()}>Add ticket</button>
        </div>
    );
}
