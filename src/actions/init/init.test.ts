import { PassThrough } from "stream";
import { createNpmInitAction } from "./init";
import { getVoidLogger } from "@backstage/backend-common";
import { executeShellCommand } from "@backstage/plugin-scaffolder-node";

jest.mock("@backstage/plugin-scaffolder-backend", () => ({
  ...jest.requireActual("@backstage/plugin-scaffolder-backend"),
  executeShellCommand: jest.fn(),
}));

describe("npm:init", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should call action", async () => {
    const action = createNpmInitAction();

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
        args: expect.arrayContaining(["init", "-y"]),
      })
    );
  });
});
