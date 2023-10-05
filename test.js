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
const axios = require("axios");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function addImageReactionToComment(
  owner,
  repo,
  pull_request_number,
  comment_id
) {
  try {
    function getRandomEmote() {
      const emotes = [
        "😊",
        "👍",
        "🙌",
        "👏",
        "🤔",
        "😂",
        "😎",
        "🔥",
        "💡",
        "✨",
      ];
      const randomIndex = Math.floor(Math.random() * emotes.length);
      return emotes[randomIndex];
    }

    // Example usage:
    const randomEmote = getRandomEmote();

    // Fetch an image from an API (e.g., The Cat API)
    const imageResponse = await axios.get(
      `https://emojik.vercel.app/s/😃_${randomEmote}?size=128`
    );
    const imageResult = imageResponse;
    // const imageResult = imageResponse.data;
    console.log(imageResult);

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

// Import any necessary libraries or functions for making API requests (e.g., fetch, axios).
// Replace this with the actual import statement for your environment.

// function getRandomEmote() {
//   const emotes = ["😊", "👍", "🙌", "👏", "🤔", "😂", "😎", "🔥", "💡", "✨"];
//   const randomIndex = Math.floor(Math.random() * emotes.length);
//   return emotes[randomIndex];
// }

// // Include the getRandomEmote and fetchEmoteImage functions here as previously defined.

// // Get a reference to the button element and the emote container
// const fetchButton = document.getElementById("fetchButton");
// const emoteContainer = document.getElementById("emoteContainer");

// // Add a click event listener to the button
// fetchButton.addEventListener("click", fetchAndDisplayEmote);

// async function fetchAndDisplayEmote() {
//   try {
//     const randomEmote = "👏";
//     const apiUrl = `https://emojik.vercel.app/s/😃_${randomEmote}?size=128`;

//     // Make the API request using the appropriate method (e.g., fetch or axios).
//     const response = await fetch(apiUrl);

//     if (!response.ok) {
//       throw new Error(`API request failed with status ${response.status}`);
//     }

//     const imageData = await response.blob();

//     // Create an image element and set its source to the fetched emote image
//     const emoteImage = document.createElement("img");
//     emoteImage.src = URL.createObjectURL(imageData);
//     emoteImage.alt = "Random Emote";

//     // Clear any previous content in the emote container
//     emoteContainer.innerHTML = "";

//     // Append the image element to the emote container
//     emoteContainer.appendChild(emoteImage);
//   } catch (error) {
//     console.error("An error occurred:", error);
//   }

//   // Ensure the function doesn't return true or a promise here.
//   // You can simply omit a return statement or return undefined.
// }
