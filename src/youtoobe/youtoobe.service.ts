import { Injectable } from '@nestjs/common';
import googleClient from 'src/auth/google-client';
import { PrismaService } from 'src/prisma/prisma.service';
import {} from 'google-auth-library';
import { google, youtube_v3 } from 'googleapis';

@Injectable()
export class YoutoobeService {
  private readonly client = googleClient.client;

  constructor(private readonly prisma: PrismaService) {}

  private async getYoutoobe(userId: number): Promise<youtube_v3.Youtube> {
    const { accessToken, refreshToken } =
      await this.prisma.authProvider.findFirst({
        where: { sourcesId: userId },
      });

    this.client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    return google.youtube({ version: 'v3', auth: this.client });
  }

  async getVideos(userId: number): Promise<Array<youtube_v3.Schema$Video>> {
    const client = await this.getYoutoobe(userId);
// trementum@trementum.iam.gserviceaccount.com
    google

    const { data } = await client.videos.list({
      part: ['snippet', 'recordingDetails', 'id', 'statistics'],
      chart: 'mostPopular',
    });

    return data.items;
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

    return { posts, account };
  }
}
