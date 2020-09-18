import * as React from "react";
import {BackendService, Ticket} from "../backend";
import {take} from "rxjs/operators";
import {useReducer} from "react";

interface ContextProviderProps {
    backend: BackendService;
}

const initialState = {loading: true as boolean, tickets: [] as Ticket[]};

type ReducerState = typeof initialState;

function reducer(state: ReducerState, action: { type: string, payload?: any }): ReducerState {
    switch (action.type) {
        case 'initialDataLoad':
            return {loading: false, tickets: action.payload};
        case 'addTicket':
            return {loading: false, tickets: [...state.tickets, action.payload]};
        case 'loadingAction':
            return {...state, loading: true};
        case 'doneLoading':
            return {...state, loading: false};
        default:
            throw new Error();
    }
}

export const useTickets = ({backend}: ContextProviderProps) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    React.useEffect(() => {
        backend.tickets()
            .pipe(take(1))
            .subscribe(ts => {
                /**
                 * If I don't do the "spread" here, it will cause the array to mutate. This is a limiation of not having
                 * a server-backend. However, I'm determined to treat the "backend" as if it were a server one, so I won't be
                 * fixing this upstream
                 */
                dispatch({type: 'initialDataLoad', payload: [...ts]});
            });
    }, [backend]);

    return {
        state,
        dispatch
    }
}

type TicketContextType = ReturnType<typeof useTickets>;

export const TicketContext = React.createContext<TicketContextType>({
    dispatch: () => {
    },
    state: initialState,
});

export const TicketDataProvider: React.FC<ContextProviderProps> = ({children, backend}) => {
    const value = useTickets({backend})
    return <TicketContext.Provider value={value}>
        {children}
    </TicketContext.Provider>
}

export const useTicketData = () => {
    return React.useContext(TicketContext);
}
