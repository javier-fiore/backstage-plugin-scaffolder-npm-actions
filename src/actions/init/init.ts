import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { getNpmCommand } from "../../utils/getNpmCommand";

export function createNpmInitAction() {
  return createTemplateAction<{}>({
    id: "npm:init",
    description:
      "Runs npm init with defaults set in the task workspace directory",

    async handler(ctx) {
      try {
        console.log(`Running npm init in ${ctx.workspacePath}`);
        ctx.logger.info(`Running npm init in ${ctx.workspacePath}`);

        const npm = getNpmCommand(ctx);

        await executeShellCommand({
          command: npm,
          args: ["init", "-y"],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        console.log("Done running npm init");
        ctx.logger.info(`Done running npm init`);
      } catch (err) {
        console.error(err);
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
