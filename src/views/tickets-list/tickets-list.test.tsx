import React from 'react';
import { fireEvent, wait } from "@testing-library/react";
import {renderHarness} from "../../constants/testing-harness";

import {BackendService} from "../../backend";
import {TicketsList} from "./tickets-list";

test('show two items in backend in list', () => {
  const backend = new BackendService();
  const { getByText } = renderHarness(backend, <TicketsList backend={backend} />);
  expect(getByText("Install a monitor arm")).toBeInTheDocument();
  expect(getByText("Move the desk to the new location")).toBeInTheDocument();
});

test("create new ticket", async () => {
  const backend = new BackendService();
  const { getByText, getByLabelText } = renderHarness(backend, <TicketsList backend={backend} />);
  const textInput = getByLabelText("Ticket description");
  fireEvent.change(textInput, {target: {value: 'Testing this now'}});
  fireEvent.click(getByText("Add ticket"));
  await wait(() => expect(getByText("Testing this now")).toBeInTheDocument());
});