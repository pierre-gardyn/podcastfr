import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import extractFilesFromPR from './extractFilesFromPR';
import validateYamlFile from '../util/validateYamlFile';

async function run() {
  try {
    // get information on everything
    const token = process.env['GH_PAT'];
    if (!token) {
      throw new Error(`missing gh token`);
    }
    const octokit = getOctokit(token);

    console.log('context.payload.pull_request:', context.payload.pull_request);
    const pullRequestNumber = context.payload.pull_request?.number;
    if (!pullRequestNumber) {
      throw new Error(`could not find pull request number`);
    }
    const files = await extractFilesFromPR(octokit, context.payload.pull_request);
    console.log('pullRequestNumber:', pullRequestNumber);
    console.log('files in PR:', files);
    if (files.length !== 1) {
      throw new Error(`PR must change one and only one file from the podcasts directory`);
    }
    const podcastYamlFile = files[0];
    const podcast = await validateYamlFile(podcastYamlFile);
    console.log('@@@ podcast from PR is:', JSON.stringify(podcast, null, '  '));
    console.log('@@ owner:', JSON.stringify(context.payload.pull_request?.base?.repo?.owner, null, '  '));
    console.log('@@ repo:', JSON.stringify(context.payload.pull_request?.base?.repo?.name, null, '  '));
    // octokit.pulls.merge({

    // })

    // const commits_url = context.payload.pull_request?.commits_url;
    // if (!commits_url) {
    //   throw new Error(`missing commits_url`);
    // }
    // const result = await octokit.request(commits_url);
    // console.log('@@@ commits_url data:', result.data);
    // if (result.data.length !== 1) {
    //   throw new Error(`only one file per PR is authorized`);
    // }
    // const commit_url = (result.data || [])[0]?.url;
    // if (!commit_url) {
    //   throw new Error(`missing commit_url`);
    // }
    // console.log('>> commit_url:', commit_url);
    // const result2 = await octokit.request(commit_url);
    // console.log('@@@ commit_url data:', result2.data);

    // const files = parse(result.data);
    // console.log('files in PR:', files);
    const errors: string[] = [];
    // //const podcastFiles: string[] = [];

    // files.forEach((prfile) => {
    //   console.log(prfile);
    // });
    if (errors.length > 0) {
      console.log('Errors:', errors.join('\n'));
      core.setFailed(errors.join('\n'));
    } else {
      // console.log('Podcast files:', podcastFiles);
      // await validate('./podcasts', podcastFiles, './content/podcasts.json');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
