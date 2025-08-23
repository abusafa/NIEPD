import React from 'react';
import {
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

export interface VideoPayload {
  src: string;
  width?: number;
  height?: number;
  key?: NodeKey;
}

export interface SerializedVideoNode extends Spread<
  {
    src: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
> {}

export class VideoNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return 'video';
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(
      node.__src,
      node.__width,
      node.__height,
      node.__key
    );
  }

  constructor(
    src: string,
    width?: number,
    height?: number,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__width = width;
    this.__height = height;
  }

  exportJSON(): SerializedVideoNode {
    return {
      src: this.__src,
      width: this.__width,
      height: this.__height,
      type: 'video',
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    const { src, width, height } = serializedNode;
    const node = $createVideoNode({
      src,
      width,
      height,
    });
    return node;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    const theme = config.theme;
    const className = theme.video;
    if (className !== undefined) {
      div.className = className;
    }
    return div;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getTextContent(): string {
    return `Video: ${this.__src}`;
  }

  decorate(): JSX.Element {
    return (
      <VideoComponent
        src={this.__src}
        width={this.__width}
        height={this.__height}
        nodeKey={this.getKey()}
      />
    );
  }
}

export function $createVideoNode({ src, width, height, key }: VideoPayload): VideoNode {
  return new VideoNode(src, width, height, key);
}

export function $isVideoNode(node: LexicalNode | null | undefined): node is VideoNode {
  return node instanceof VideoNode;
}

interface VideoComponentProps {
  src: string;
  width?: number;
  height?: number;
  nodeKey: NodeKey;
}

function VideoComponent({ src, width = 560, height = 315 }: VideoComponentProps): JSX.Element {
  // Extract video ID from various video platforms
  const getEmbedUrl = (url: string): string => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/(?:vimeo\.com\/)([^&\n?#]+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // If it's already an embed URL or a direct video file, return as is
    return url;
  };

  const embedUrl = getEmbedUrl(src);
  const isVideoFile = src.match(/\.(mp4|webm|ogg)$/i);

  return (
    <div className="video-container" style={{ 
      maxWidth: '100%', 
      margin: '16px 0',
      textAlign: 'center'
    }}>
      {isVideoFile ? (
        <video
          controls
          width={width}
          height={height}
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          <source src={src} type={`video/${src.split('.').pop()}`} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <iframe
          width={width}
          height={height}
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ 
            maxWidth: '100%', 
            aspectRatio: '16/9',
            height: 'auto'
          }}
        />
      )}
    </div>
  );
}
