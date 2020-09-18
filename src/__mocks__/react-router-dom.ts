/**
 * Upon second thought, this should probably be moved into the "tickets-view" test and `unmock` in an `afterAll` to keep
 * the test concerns seperated
 */
jest.mock("react-router-dom", () => {
    const router = jest.requireActual("react-router-dom");

    // Does not actually add any delay to avoid timing issues with backend
    const useParams = () => {
        return {
            ticketId: '1'
        }
    };

    return {
        ...router,
        useParams,
    };
});

// Silence TS saying "it must be a module"
export {};
