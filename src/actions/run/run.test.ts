import { PassThrough } from "stream";
import { createNpmRunAction } from "./run";
import { getVoidLogger } from "@backstage/backend-common";
import { executeShellCommand } from "@backstage/plugin-scaffolder-node";

jest.mock("@backstage/plugin-scaffolder-backend", () => ({
  ...jest.requireActual("@backstage/plugin-scaffolder-backend"),
  executeShellCommand: jest.fn(),
}));

describe("npm:run", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call action", async () => {
    const action = createNpmRunAction();

    const logger = getVoidLogger();

    await action.handler({
      input: { arguments: [] },
      workspacePath: "/tmp",
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        throw new Error("Not implemented");
      },
      // Add the missing properties
      checkpoint: jest.fn(),
      getInitiatorCredentials: jest.fn(),
    });

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: expect.stringContaining("npm"),
        args: expect.arrayContaining(["run"]),
      })
    );
  });

  it("should call action with given arguments", async () => {
    const action = createNpmRunAction();

    const logger = getVoidLogger();

    const mockArgs = ["one", "two", "three"];

    await action.handler({
      input: { arguments: mockArgs },
      workspacePath: "/tmp",
      logger,
      logStream: new PassThrough(),
      output: jest.fn(),
      createTemporaryDirectory() {
        throw new Error("Not implemented");
      },
      // Add the missing properties
      checkpoint: jest.fn(),
      getInitiatorCredentials: jest.fn(),
    });

    expect(executeShellCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: expect.stringContaining("npm"),
        args: expect.arrayContaining(["run", ...mockArgs]),
      })
    );
  });
});
