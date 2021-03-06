import * as React from 'react';
import {BackendService, Ticket, User} from "../../backend";
import {useTicketData} from "../../constants/ticket-data-context";
import {useParams} from 'react-router-dom';
import {Snackbar} from "../../components/snackbar";
import './ticket-view.css';

interface TicketViewProps {
    backend: BackendService;
}

export const TicketView = ({backend}: TicketViewProps) => {
    const {state, dispatch} = useTicketData();

    const [selectedTicket, setTicket] = React.useState<Ticket | null>(null);
    const [selectedUser, setUser] = React.useState<User | null>(null);
    const [users, setUsers] = React.useState<User[] | null>(null);
    const [err, setErr] = React.useState('');

    // I decided that this was an instance of local loading instead of a more global,
    // state-wide loading procedure. To provide a good experience to the user, I decided to leave this here
    const [loadingTickets, setLoadingTickets] = React.useState(true);
    const [loadingUser, setLoadingUser] = React.useState(true);

    // Ideally, I'd move all errors to use the snackbar of some kind and render a shell around
    // the page, so that the user isn't just "stuck" with no kind of UI
    const [snackbarMessage, setSnackMsg] = React.useState('');

    const {ticketId} = useParams<{ ticketId: string }>();

    React.useEffect(() => {
        if (!ticketId || err || selectedTicket || !state.tickets) return;
        setLoadingTickets(true)

        const getUsers = backend.users().toPromise()
            .then(setUsers)

        const getTicket = backend.ticket(+ticketId).toPromise()
            .then(ticket => {
                if (!ticket) {
                    setErr('There is no ticket with the id of ' + ticketId)
                } else {
                    setTicket(ticket)
                }
            })
            .catch(() => {
                setErr('There was an issue getting your ticket')
            });

        Promise.all([getUsers, getTicket])
            .then(() => setLoadingTickets(false))
            .catch(() => setLoadingTickets(false))
    }, [err, state.tickets, ticketId, selectedTicket, dispatch, backend])

    React.useEffect(() => {
        if (err || !selectedTicket) return;

        if (selectedTicket.assigneeId) {
            backend.user(selectedTicket.assigneeId).toPromise()
                .then(user => {
                    if (user) setUser(user);
                    setLoadingUser(false);
                })
                .catch(() => {
                    setErr('There was an error getting the assigned user')
                    setLoadingUser(false);
                })
            return;
        }

        setLoadingUser(false);
    }, [selectedTicket, err, backend]);

    const onUserSelect = (id: string) => {
        // This is making the assumption that there is no server-side pagination of any kind. If there were, we'd likely
        // do a fresh call on `backend.user`
        const newAssignedUser = users!.find(usr => +usr.id === +id);
        if (!newAssignedUser) {
            // This should never hit, but might as well be careful here
            // It also fixes some TS issues
            setErr('There was an issue selecting the user to assign to the ticket')
            return;
        }
        setUser(newAssignedUser);
        backend.assign(+ticketId, +id).toPromise()
            .then(() => {
                setSnackMsg('The user has been assigned to the ticket')
            })
            .catch(() => setErr('There was an error assigning the user to the ticket'))
    }

    if (err.length) return <p>{err}</p>

    const loading = loadingUser || loadingTickets;

    return (
        <div className="mainContainer viewContainer">
            <h1 className="subtitle">Ticket Details</h1>
            {loading && <p className="secondary">Loading...</p>}
            {selectedTicket && <p className="body ticketDesc">{selectedTicket.description}</p>}
            {selectedUser && <p className="body">Assigned to {selectedUser.name}</p>}
            {users &&
                <label className="userSelectLabel">
                    <span>Select a user to assign the ticket to</span>
                    <select className="userSelect"
                            value={selectedUser?.id || ""} onChange={event => onUserSelect(event.target.value)}>
                        <option value={""}></option>
                        {
                            users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)
                        }
                    </select>
                </label>
            }
            <Snackbar show={!!snackbarMessage.length} setShow={v => v ? null : setSnackMsg('')}
                      message={snackbarMessage}/>
        </div>
    );
}
