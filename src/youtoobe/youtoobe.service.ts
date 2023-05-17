import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { youtube_v3 } from 'googleapis';
import { GoogleService } from 'src/google/google.service';

@Injectable()
export class YoutoobeService extends GoogleService {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async getChannels(userId: number) {
    const client = await this.getYoutoobe(userId);

    const { data } = await client.channels.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      mine: true,
    });

    await Promise.all(
      data.items.map((channel) => {
        return this.prisma.accounts.upsert({
          where: { channelId: channel.id },
          create: {
            provider: 'youtoobe',
            link: `https://www.youtube.com/${channel.snippet.customUrl}`,
            sourcesId: userId,
            channelId: channel.id,
          },
          update: {
            link: `https://www.youtube.com/${channel.snippet.customUrl}`,
          },
        });
      }),
    );

    return data.items;
  }

  async getPosts(userId: number) {
    const client = await this.getYoutoobe(userId);

    const { channelId, id: accountId } = await this.prisma.accounts.findFirst({
      where: { sourcesId: userId },
    });

    const { data } = await client.playlists.list({ part: ['id'], channelId });

    const playListsItems: youtube_v3.Schema$PlaylistItem[] = (
      await Promise.all(
        data.items.map(async ({ id: playlistId }) => {
          const { data } = await client.playlistItems.list({
            part: ['snippet', 'contentDetails'],
            playlistId,
          });

          return data.items;
        }),
      )
    ).flat();

    return await Promise.all(
      playListsItems.map(({ snippet, id: postId }) => {
        const { title, description, publishedAt } = snippet;

        return this.prisma.posts.upsert({
          where: { postId },
          update: { description, title },
          create: { description, title, postId, accountId, publishedAt },
        });
      }),
    );
  }

  async getFilteredPosts(userId: number, start: string, end: string) {
    const { posts, ...account } = await this.prisma.accounts.findFirst({
      where: { sourcesId: userId },
      include: {
        posts: {
          where: { publishedAt: { gte: new Date(start), lte: new Date(end) } },
        },
      },
    });

    const { spreadsheets } = await this.getSheets(userId);

    const values = posts
      .map((post, index) => {
        const result = [Object.values(post).map((v) => v.toString())];
        if (!index) {
          result.unshift(Object.keys(post));
        }
        return result;
      })
      .concat([
        Object.keys(account),
        Object.values(account).map((v) => v.toString()),
      ]);

    await spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SPREADSHEETID,
      range: `A1:G${values.length}`,
      valueInputOption: 'RAW',
      requestBody: { values },
    });

    return { posts, account };
  }
}
