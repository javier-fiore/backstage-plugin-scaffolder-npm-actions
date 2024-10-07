import { PassThrough } from "stream";
import { createNpmExecAction } from "./exec";
import { getVoidLogger } from "@backstage/backend-common";
import { executeShellCommand } from "@backstage/plugin-scaffolder-node";

jest.mock("@backstage/plugin-scaffolder-backend", () => ({
  ...jest.requireActual("@backstage/plugin-scaffolder-backend"),
  executeShellCommand: jest.fn(),
}));

describe("npm:exec", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call action", async () => {
    const action = createNpmExecAction();

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
        args: expect.arrayContaining(["exec"]),
      })
    );
  });

  it("should call action with given arguments", async () => {
    const action = createNpmExecAction();

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
        args: expect.arrayContaining(["exec", ...mockArgs]),
      })
    );
  });
});
