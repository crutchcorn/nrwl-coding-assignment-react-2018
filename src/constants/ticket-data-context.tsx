import * as React from "react";
import {BackendService, Ticket} from "../backend";
import {take} from "rxjs/operators";
import {useReducer} from "react";

interface ContextProviderProps {
    backend: BackendService;
}

export enum StateEnum {
    LOADING,
    ERROR,
    SUCCESS
}

interface StateError {
    state: StateEnum.ERROR,
    tickets: null;
    stateMessage: string;
}

interface StateLoading {
    state: StateEnum.LOADING;
    // Will be `null` if dispatched initially, will be [] if dispatched with "addTicket"
    tickets: Ticket[] | null;
    stateMessage: '';
}

interface StateSuccess {
    state: StateEnum.SUCCESS;
    tickets: Ticket[];
    stateMessage: '';
}

type State = StateError | StateLoading | StateSuccess;

const initialState: State = {state: StateEnum.LOADING, stateMessage: '', tickets: null};

type ReducerState = State;

type ReducerEnum = 'initialDataLoad' |
    'addTicket' |
    'loadingAction' |
    'doneLoading' |
    'errorInitial';

function reducer(state: ReducerState, action: { type: ReducerEnum, payload?: any }): ReducerState {
    switch (action.type) {
        case 'initialDataLoad':
            return {stateMessage: '', state: StateEnum.SUCCESS, tickets: action.payload};
        case 'addTicket':
            return {stateMessage: '', state: StateEnum.SUCCESS, tickets: [...(state.tickets || []), action.payload]};
        case 'loadingAction':
            return {...state, stateMessage: '', state: StateEnum.LOADING};
        case 'errorInitial':
            return {state: StateEnum.ERROR, stateMessage: action.payload, tickets: null}
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
            }, err => {
                dispatch({type: 'errorInitial', payload: err.message || err})
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
