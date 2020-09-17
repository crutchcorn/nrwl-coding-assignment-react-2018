import * as React from "react";
import {BackendService} from "./backend";
import {take} from "rxjs/operators";
import {TicketDataProvider, useTicketData} from "./context";

interface AppProps {
    backend: BackendService;
}

const AppBase = ({backend}: AppProps) => {
    const {state, dispatch} = useTicketData();

    const addTicket = () => {
        dispatch({type: 'loadingAction'});
        backend.newTicket({description: "This is a test"})
            .pipe(take(1))
            .toPromise()
            .then(newTick => {
                dispatch({type: 'addTicket', payload: newTick});
            });
    }

    return (
        <div>
            <h2>Tickets</h2>
            {state.loading && <p aria-live='polite'>Loading...</p>}
            {state.tickets ? (
                <ul>
                    {state.tickets.map(t => (
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

const App = ({backend}: AppProps) => {
    return <TicketDataProvider backend={backend}>
        <AppBase backend={backend}/>
    </TicketDataProvider>
}

export default App;
