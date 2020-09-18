/**
 * I've had to make some minor code changes to fix TypeScript typings, but wanted to keep the API shape/behavior consistent.
 * The way I thought about it was "there are some APIs that we're not able to change for various reasons".
 *
 * If I were to change the way the API itself functions, I'd probably make "tickets" return the new set of tickets,
 * so that I could retrieve the new set of tickets from the array instead of just the first set of array
 * (this behavior is pretty clearly a bug, but I'm able to work around it for now. If I were to fix it, I'd use a Subject
 * of some kind in order to run a ".next" after creating a ticket and update the subscription
 */

import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

/**
 * This service acts as a mock back-end.
 * It has some intentional errors that you might have to fix.
 */

export type User = {
  id: number;
  name: string;
};

export type Ticket = {
  id: number;
  description: string;
  assigneeId: number | null;
  completed: boolean;
};

function randomDelay() {
  return Math.random() * 4000;
}

export class BackendService {
  storedTickets: Ticket[] = [
    {
      id: 0,
      description: 'Install a monitor arm',
      assigneeId: 111,
      completed: false
    },
    {
      id: 1,
      description: 'Move the desk to the new location',
      assigneeId: 111,
      completed: false
    }
  ];

  storedUsers: User[] = [{ id: 111, name: 'Victor' }, { id: 222, name: 'Corbin'}];

  lastId = 1;

  constructor() { }

  private findTicketById = (id: string | number) =>
    this.storedTickets.find(ticket => ticket.id === +id);
  private findUserById = (id: string | number) => this.storedUsers.find(user => user.id === +id);

  tickets() {
    return of(this.storedTickets).pipe(delay(randomDelay()));
  }

  ticket(id: number): Observable<Ticket> {
    return of(this.findTicketById(id)!).pipe(delay(randomDelay()));
  }

  users() {
    return of(this.storedUsers).pipe(delay(randomDelay()));
  }

  user(id: number) {
    return of(this.findUserById(id)).pipe(delay(randomDelay()));
  }

  newTicket(payload: { description: string }) {
    const newTicket: Ticket = {
      id: ++this.lastId,
      description: payload.description,
      assigneeId: null,
      completed: false
    };

    return of(newTicket).pipe(
      delay(randomDelay()),
      tap((ticket: Ticket) => this.storedTickets.push(ticket))
    );
  }

  assign(ticketId: number, userId: number) {
    const foundTicket = this.findTicketById(+ticketId);
    const user = this.findUserById(+userId);

    if (foundTicket && user) {
      return of(foundTicket).pipe(
        delay(randomDelay()),
        tap((ticket: Ticket) => {
          ticket.assigneeId = +userId;
        })
      );
    }

    return throwError(new Error('ticket or user not found'));
  }

  complete(ticketId: number, completed: boolean) {
    const foundTicket = this.findTicketById(+ticketId);
    if (foundTicket) {
      return of(foundTicket).pipe(
        delay(randomDelay()),
        tap((ticket: Ticket) => {
          ticket.completed = true;
        })
      );
    }

    return throwError(new Error('ticket not found'));
  }
}
