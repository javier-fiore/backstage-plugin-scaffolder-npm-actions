import {
  createTemplateAction,
  executeShellCommand,
} from "@backstage/plugin-scaffolder-node";
import { getNpmCommand } from "../../utils/getNpmCommand";

export function createNpmInstallAction() {
  return createTemplateAction<{ packageToInstall: string }>({
    id: "npm:install",
    description: "Runs npm install quietly with the given package name",
    supportsDryRun: true,
    schema: {
      input: {
        type: "object",
        required: [],
        properties: {
          packageToInstall: {
            title: "Name of package to install",
            description: "Name of package to install",
            type: "string",
          },
        },
      },
    },
    async handler(ctx) {
      try {
        console.log(`Running npm install in ${ctx.workspacePath}`);
        ctx.logger.info(`Running npm install in ${ctx.workspacePath}`);

        const npm = getNpmCommand(ctx);

        await executeShellCommand({
          command: npm,
          args: ["install", ctx.input.packageToInstall],
          logStream: ctx.logStream,
          options: { cwd: ctx.workspacePath },
        });

        console.log("Done running npm install");
        ctx.logger.info(`Done running npm install`);
      } catch (err) {
        console.error(err);
        ctx.logger.error(err);
        throw err;
      }
    },
  });
}
