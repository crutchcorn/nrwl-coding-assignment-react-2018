import * as React from 'react';
import {BackendService} from "~backend";
import {useTicketData} from "~constants/ticket-data-context";
import {take} from "rxjs/operators";
import {
    Link
} from "react-router-dom";
import './tickets-list.css'

interface TicketsListProps {
    backend: BackendService;
}

export const TicketsList = ({backend}: TicketsListProps) => {
    const {state, dispatch} = useTicketData();

    const [newTicket, setTicket] = React.useState('');

    const [err, setErr] = React.useState('');

    const addTicket = () => {
        // Ideally, if I had time, we'd do some data validation here
        if (!newTicket) return;
        dispatch({type: 'loadingAction'});
        backend.newTicket({description: newTicket})
            .pipe(take(1))
            .toPromise()
            .then(newTick => {
                dispatch({type: 'addTicket', payload: newTick});
                setTicket('');
            })
            .catch(() => setErr('There was an issue getting your tickets'));
    }

    if (err.length) return <p>{err}</p>

    return (
        <div className="mainContainer">
            <div className="ticketsListContainer">
                {state.loading && <p className="subtitle" aria-live='polite'>Loading...</p>}
                {state.tickets && <>
                    <h1 className="subtitle">Tickets ({state.tickets.length})</h1>
                <ul className="ticketList">
                    {state.tickets.map(t => (
                        <li key={t.id}>
                            <Link to={`/${t.id}`} className="body">
                                {t.description}
                            </Link>
                        </li>
                    ))}
                </ul>
                </>
                }
            </div>
            <div className="createTicketView">
                <h2 className="subtitle">Add new ticket:</h2>
                <label className="textLabel">
                    <span className="secondary">Ticket description</span>
                    <input className="textInp"onChange={e => setTicket(e.target.value)} value={newTicket}/>
                </label>
                <button className="btnBase body" onClick={() => addTicket()}>Add ticket</button>
            </div>
        </div>
    );
}
