import * as React from 'react';
import {BackendService, Ticket} from "./backend";
import {useTicketData} from "./context";
import {useParams} from 'react-router-dom';

interface TicketsViewProps {
    backend: BackendService;
}

export const TicketsView = ({backend}: TicketsViewProps) => {
    const {state, dispatch} = useTicketData();

    const [selectedTicket, setTicket] = React.useState<Ticket | null>(null);
    const [err, setErr] = React.useState('');

    const {ticketId} = useParams<{ ticketId: string }>();

    React.useEffect(() => {
        if (err || selectedTicket || !state.tickets) return;
        dispatch({type: 'loadingAction'})
        backend.ticket(+ticketId).toPromise()
            .then(ticket => {
                if (!ticket) {
                    setErr('There is no ticket with the id of ' + ticketId)
                } else {
                    setTicket(ticket)
                }
                dispatch({type: 'doneLoading'})
            })
            .catch(() => {
                setErr('There was an issue getting your ticket')
                dispatch({type: 'doneLoading'})
            });
    }, [err, state, ticketId, selectedTicket])


    if (err.length) return <p>{err}</p>

    return (
        <div>
            {state.loading && <p>Loading...</p>}
            {selectedTicket && <p>{selectedTicket.description}</p>}
        </div>
    );
}
