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

async function addImageReactionToComment(
  owner,
  repo,
  pull_request_number,
  comment_id
) {
  try {
    // Fetch an image from an API (e.g., The Cat API)
    const imageResponse = await fetch(
      "https://api.thecatapi.com/v1/images/search"
    );
    const imageResult = await imageResponse.json();

    if (imageResult && imageResult[0] && imageResult[0].url) {
      // Create a comment with the image
      const imageComment = `![Cat](${imageResult[0].url})`;

      // Post the image as a comment reaction
      await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
          owner,
          repo,
          issue_number: pull_request_number,
          body: imageComment,
        }
      );

      console.log("Image reaction added successfully!");
    } else {
      console.error("No image URL found in the API response.");
    }
  } catch (error) {
    console.error("Error adding image reaction:", error.message);
  }
}

const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
const pull_request_number = process.env.GITHUB_EVENT_NUMBER;
const comment_id = process.env.GITHUB_COMMENT_ID;

addImageReactionToComment(owner, repo, pull_request_number, comment_id);
