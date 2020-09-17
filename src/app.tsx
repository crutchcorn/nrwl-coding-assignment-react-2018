import * as React from "react";
import {BackendService} from "./backend";
import {TicketDataProvider} from "./context";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import {TicketsList} from "./tickets-list";
import {TicketsView} from "./ticket-view";

interface AppProps {
    backend: BackendService;
}

const App = ({backend}: AppProps) => {
    return (
        <TicketDataProvider backend={backend}>
            <Router>
                <Switch>
                    <Route path="/:ticketId">
                        <TicketsView backend={backend}/>
                    </Route>
                    <Route path="/">
                        <TicketsList backend={backend}/>
                    </Route>
                </Switch>
            </Router>
        </TicketDataProvider>
    );
};

export default App;
