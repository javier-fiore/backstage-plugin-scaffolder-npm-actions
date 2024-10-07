import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { getNpmCommand } from "../../utils/getNpmCommand";

export function createNpmConfigAction() {
  return createTemplateAction<{ arguments: string[] }>({
    id: "npm:config",
    description:
      "Runs npm config with the given arguments in the task workspace directory",
    supportsDryRun: true,
    schema: {
      input: {
        type: "object",
        required: ["arguments"],
        properties: {
          arguments: {
            title: "Arguments",
            description: "The arguments to pass to the npm config command",
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
        console.log(`Running npm config in ${ctx.workspacePath}`);
        ctx.logger.info(`Running npm config in ${ctx.workspacePath}`);
        ctx.logger.info(`Input: ${ctx.input.arguments}`);

        const npm = getNpmCommand(ctx);

        ctx.logger.info(
          `OS platform is ${process.platform}, using '${npm}' as command`
        );

        await executeShellCommand({
          command: npm,
          args: ["config", ...ctx.input.arguments],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        console.log("Done running npm config");
        ctx.logger.info(`Done running npm config`);
      } catch (err) {
        console.error(err);
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
