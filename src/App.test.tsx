import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import App from './App';

import {BackendService} from "./backend";

test('show two items in backend in list', () => {
  const backend = new BackendService();
  const { getByText } = render(<App backend={backend} />);
  expect(getByText("Install a monitor arm")).toBeInTheDocument();
  expect(getByText("Move the desk to the new location")).toBeInTheDocument();
});

test("create new ticket", () => {
  const backend = new BackendService();
  const { getByText, getByLabelText } = render(<App backend={backend} />);
  const textInput = getByLabelText("Ticket description");
  fireEvent.change(textInput, {target: {value: 'Testing this now'}});
  fireEvent.click(getByText("Add ticket"));
  expect(getByText("Testing this now")).toBeInTheDocument();
});

