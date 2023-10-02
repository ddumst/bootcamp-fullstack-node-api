export interface UserVideo {
  userId: number;
  isActive: boolean;
  youtubeChannelId: number;
  youtubeChannel: YoutubeChannel
}

export interface YoutubeChannel {
  channelLink: string;
  channelId: string;
  template: string;
  isActive: boolean;
}

export interface VideoViewProps {
  channelId: string;
}

export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
  enclosures: string[]
}