// I'm admittedly not sure why, but "backend" fails to construct in tests without this present
// I suspect it has something to do with my mock down below, or maybe it's something to do with
// es module interop and I'm making it "default"? I'm unfortunately limited on time to research further :(
jest.mock('rxjs', () => {
    const rxjs = jest.requireActual("rxjs");
    return rxjs;
})

jest.mock("rxjs/operators", () => {
  const rxjs = jest.requireActual("rxjs/operators");

  // Does not actually add any delay to avoid timing issues with backend
  const delay = (delay: number | Date) => {
    return (source: any) => source;
  };

  return {
    ...rxjs,
    delay,
  };
});

// Silence TS saying "it must be a module"
export {};
