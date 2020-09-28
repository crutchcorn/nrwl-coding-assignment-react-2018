import * as React from 'react';
import {BackendService} from "../../backend";
import {StateEnum, useTicketData} from "../../constants/ticket-data-context";
import {take} from "rxjs/operators";
import {
    Link
} from "react-router-dom";
import './tickets-list.css'
import {FormEvent} from "react";

interface TicketsListProps {
    backend: BackendService;
    onSearch?: () => void;
}

export const TicketsList = ({backend, onSearch}: TicketsListProps) => {
    const {state, dispatch} = useTicketData();

    const [newTicket, setTicket] = React.useState('');

    const [search, setSearch] = React.useState('');

    const [localErr, setErr] = React.useState('');

    const filteredTickets = React.useMemo(() => {
        if (!state.tickets) return [];
        if (!search) return state.tickets;
        onSearch && onSearch();
        return state.tickets.filter(stateTick => stateTick.description.includes(search));
    }, [state.tickets, search, onSearch])

    const addTicket = (e: FormEvent) => {
        // Ideally, if I had time, we'd do some data validation here
        e.preventDefault();
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

    const err = localErr || state.stateMessage || '';

    if (err.length) return <p>{err}</p>

    return (
      <div className="mainContainer">
        <div className="ticketsListContainer">
          {state.state === StateEnum.LOADING && (
            <p className="subtitle" aria-live="polite">
              Loading...
            </p>
          )}
          {state.tickets && (
            <>
              <label className="textLabel">
                <span className="secondary">Ticket search</span>
                <input
                  className="textInp"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
              </label>

              <h1 className="subtitle">Tickets ({filteredTickets.length})</h1>
              <ul className="ticketList">
                {filteredTickets.map((t) => (
                  <li key={t.id}>
                    <Link to={`/${t.id}`} className="body">
                      {t.description}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <form className="createTicketView" onSubmit={(e) => addTicket(e)}>
          <h2 className="subtitle">Add new ticket:</h2>
          <label className="textLabel">
            <span className="secondary">Ticket description</span>
            <input
              className="textInp"
              onChange={(e) => setTicket(e.target.value)}
              value={newTicket}
            />
          </label>
          <button className="btnBase body" type='submit'>
            Add ticket
          </button>
        </form>
      </div>
    );
}
