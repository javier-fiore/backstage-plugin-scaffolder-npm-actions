import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { getNpmCommand } from "../../utils/getNpmCommand";

export function createNpmRunAction() {
  return createTemplateAction<{ arguments: string[] }>({
    id: "npm:run",
    description:
      "Runs npm run with the given arguments in the task workspace directory",
    supportsDryRun: true,
    schema: {
      input: {
        type: "object",
        required: ["arguments"],
        properties: {
          arguments: {
            title: "Arguments",
            description: "The arguments to pass to the npm run command",
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      },
    },
    async handler(ctx) {
      try {
        console.log(`Running npm run in ${ctx.workspacePath}`);
        ctx.logger.info(`Running npm run in ${ctx.workspacePath}`);
        ctx.logger.info(`Input: ${ctx.input.arguments}`);

        const npm = getNpmCommand(ctx);

        await executeShellCommand({
          command: npm,
          args: ["run", ...ctx.input.arguments],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        console.log("Done running npm run");
        ctx.logger.info(`Done running npm run`);
      } catch (err) {
        console.error(err);
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
