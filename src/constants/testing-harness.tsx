import {TicketDataProvider} from "./ticket-data-context";
import * as React from "react";
import {BackendService} from "../backend";
import {render} from "@testing-library/react";
import {BrowserRouter as Router} from "react-router-dom";

interface TestingHarnessProps {
    backend: BackendService;
}

export const TestingHarness: React.FC<TestingHarnessProps> = ({backend, children}) => {
    return (
        <TicketDataProvider backend={backend}>
            <Router>
                {children}
            </Router>
        </TicketDataProvider>
    )
}

export const renderHarness = (backend: BackendService, comp: JSX.Element) => render(<TestingHarness
    backend={backend}>{comp}</TestingHarness>);
