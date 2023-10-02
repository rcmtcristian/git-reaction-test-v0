// const { inspect } = require("util");
// const core = require("@actions/core");
// const github = require("@actions/github");

// const REACTION_TYPES = [
//   "+1",
//   "-1",
//   "laugh",
//   "confused",
//   "heart",
//   "hooray",
//   "rocket",
//   "eyes",
// ];

// async function addReactions(octokit, repo, issueNumber, reactions) {
//   let ReactionsSet = [
//     ...new Set(
//       reactions
//         .replace(/\s/g, "")
//         .split(",")
//         .filter((item) => {
//           if (!REACTION_TYPES.includes(item)) {
//             core.info(`Skipping invalid reaction '${item}'.`);
//             return false;
//           }
//           return true;
//         })
//     ),
//   ];

//   if (!ReactionsSet) {
//     core.setFailed(`No valid reactions are contained in '${reactions}'.`);
//     return false;
//   }

//   let results = await Promise.allSettled(
//     ReactionsSet.map(async (item) => {
//       await octokit.rest.reactions.createForIssue({
//         owner: repo[0],
//         repo: repo[1],
//         issue_number: issueNumber,
//         content: item,
//       });
//       core.info(`Setting '${item}' reaction on issue.`);
//     })
//   );

//   for (let i = 0, l = results.length; i < l; i++) {
//     if (results[i].status === "fulfilled") {
//       core.info(
//         `Added reaction '${ReactionsSet[i]}' to issue number '${issueNumber}'.`
//       );
//     } else if (results[i].status === "rejected") {
//       core.info(
//         `Adding reaction '${ReactionsSet[i]}' to issue number '${issueNumber}' failed with ${results[i].reason}.`
//       );
//     }
//   }
//   ReactionsSet = undefined;
//   results = undefined;
// }

// async function run() {
//   try {
//     const inputs = {
//       token: core.getInput("token"),
//       repository: core.getInput("repository"),
//       issueNumber: core.getInput("issue-number"),
//       reactions: core.getInput("reactions"),
//     };
//     core.debug(`Inputs: ${inspect(inputs)}`);

//     const repository = inputs.repository
//       ? inputs.repository
//       : process.env.GITHUB_REPOSITORY;
//     const repo = repository.split("/");
//     core.debug(`repository: ${repository}`);

//     const octokit = github.getOctokit(inputs.token);

//     if (inputs.issueNumber) {
//       if (inputs.reactions) {
//         await addReactions(octokit, repo, inputs.issueNumber, inputs.reactions);
//       } else {
//         core.setFailed("Missing 'reactions'.");
//         return;
//       }
//     } else {
//       core.setFailed("Missing 'issue-number'.");
//       return;
//     }
//   } catch (error) {
//     core.debug(inspect(error));
//     core.setFailed(error.message);
//     if (error.message == "Resource not accessible by integration") {
//       core.error(`See this action's readme for details about this error`);
//     }
//   }
// }

// run();
const { Octokit } = require("@octokit/core");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function addReactionToComment(
  owner,
  repo,
  pull_request_number,
  comment_id
) {
  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments/{comment_id}/reactions",
      {
        owner,
        repo,
        issue_number: pull_request_number,
        comment_id,
        content: "-1, ", // You can customize the reaction content here
      }
    );
    console.log("Reaction added successfully!");
  } catch (error) {
    console.error("Error adding reaction:", error.message);
  }
}

const { owner, repo, number, id } = process.env.GITHUB;
addReactionToComment(owner, repo, number, id);
