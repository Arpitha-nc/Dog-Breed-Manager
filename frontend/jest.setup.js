import "@testing-library/jest-dom";
import { server } from "./src/mocks/server.js";
beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

global.scrollTo = jest.fn();

window.HTMLDialogElement.prototype.showModal = jest.fn();
window.HTMLDialogElement.prototype.close = jest.fn();
