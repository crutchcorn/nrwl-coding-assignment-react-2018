import React from 'react';
import { fireEvent, wait } from "@testing-library/react";
import {renderHarness} from "../../constants/testing-harness";

import {BackendService} from "../../backend";
import {TicketsList} from "./tickets-list";

test('show two items in backend in list', () => {
  const backend = new BackendService();
  const { getByText } = renderHarness(backend, <TicketsList backend={backend} onSearch={() => {}} />);
  expect(getByText("Install a monitor arm")).toBeInTheDocument();
  expect(getByText("Move the desk to the new location")).toBeInTheDocument();
});

test("create new ticket", async () => {
  const backend = new BackendService();
  const { getByText, getByLabelText } = renderHarness(backend, <TicketsList backend={backend} onSearch={() => {}} />);
  const textInput = getByLabelText("Ticket description");
  fireEvent.change(textInput, {target: {value: 'Testing this now'}});
  fireEvent.click(getByText("Add ticket"));
  await wait(() => expect(getByText("Testing this now")).toBeInTheDocument());
});


test("filter on ticket", async () => {
  const backend = new BackendService();
  const { getByText, getByLabelText, queryByText } = renderHarness(backend, <TicketsList backend={backend} onSearch={() => {}} />);
  const textInput = getByLabelText("Ticket search");
  fireEvent.change(textInput, {target: {value: 'monitor'}});
  await wait(() => expect(getByText("Install a monitor arm")).toBeInTheDocument());
  await wait(() => expect(queryByText("Move the desk to the new location")).not.toBeInTheDocument());
});


test("memoizes filter", async () => {
  const backend = new BackendService();
  const onSearch = jest.fn();
  const { getByLabelText } = renderHarness(backend, <TicketsList backend={backend} onSearch={onSearch} />);
  const textInput = getByLabelText("Ticket search");
  fireEvent.change(textInput, {target: {value: 'monitor'}});
  await wait(() => expect(onSearch).toBeCalledTimes(1));
  fireEvent.change(textInput, {target: {value: 'monitor'}});
  await wait(() => expect(onSearch).toBeCalledTimes(1));
});
