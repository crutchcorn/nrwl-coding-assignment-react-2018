import React from 'react';
import { fireEvent, wait } from "@testing-library/react";
import {renderHarness} from "../../constants/testing-harness";

import {BackendService} from "../../backend";
import {TicketView} from "./ticket-view";

test('show basic information about ticket', async () => {
  const backend = new BackendService();
  const { getByText } = renderHarness(backend, <TicketView backend={backend} />);
  await wait(() => expect(getByText("Move the desk to the new location")).toBeInTheDocument());
  await wait(() => expect(getByText("Victor")).toBeInTheDocument());
});

test("assign the ticket", async () => {
  const backend = new BackendService();
  const { getByText, getByLabelText } = renderHarness(backend, <TicketView backend={backend} />);
  await wait(() => expect(getByText("Select a user to assign the ticket to")).toBeInTheDocument());
  const selectBox = getByLabelText("Select a user to assign the ticket to");
  // Select "Corbin"
  fireEvent.change(selectBox, {target: {value: '222'}});
  await wait(() => expect(getByText("Corbin")).toBeInTheDocument());
});
