import fs from 'fs-extra';
import validateYamlFile from './validateYamlFile';
import validateFeedUrls from './validateFeedUrls';
import validateContentFile from '../generate/validateContentFile';

import getPodcastDescriptionsFiles from './getPodcastDescriptionsFiles';
import getPodcastFeedUrl from './getPodcastFeedUrl';
import extractPodcastInfoFromRss from './extractPodcastInfoFromRss';
import { Podcast } from '../jtd/podcast';

export default async function validate(
  podcastsDirectory: string,
  filesToValidate: string[],
  resultFile: string,
): Promise<void> {
  const files = await getPodcastDescriptionsFiles(podcastsDirectory, filesToValidate);
  const podcasts = await validateContentFile(resultFile);

  for (const fileName of files) {
    const description = await validateYamlFile(fileName);
    if (description.ignore) {
      continue;
    }
    console.log(description);
    const feedUrls = await validateFeedUrls(description);
    console.log('FeedUrls:');
    console.log(feedUrls);
    const rssUrl = await getPodcastFeedUrl(feedUrls);
    console.log('rssUrl:', rssUrl);
    if (rssUrl) {
      if (!feedUrls.rss) {
        feedUrls.rss = rssUrl;
      }
      const info = await extractPodcastInfoFromRss(rssUrl);
      console.log(info);

      const newPodcast: Podcast = {
        meta: {
          fileName: fileName,
        },
        information: info,
        feedUrls: feedUrls,
      };

      const ix = podcasts.findIndex((p) => p.meta.fileName === fileName);
      if (ix < 0) {
        podcasts.push(newPodcast);
      } else {
        podcasts[ix] = newPodcast;
      }
    }
  }
  console.log(podcasts);
  await fs.writeJSON(resultFile, podcasts, {
    spaces: 2,
  });
}