type GeneralEventTypes = {
    [EventName: string]: unknown[];
};
type EventListener<EventTypes extends GeneralEventTypes, EventName extends keyof EventTypes> = (...args: EventTypes[EventName]) => void;
/** A simple event emitter that can be used to listen to and emit events. */
declare class EventEmitter<EventTypes extends GeneralEventTypes> {
    private listeners;
    /** Subscribe to an event. Returns an unsubscribe function. */
    on<EventName extends keyof EventTypes>(event: EventName, listener: EventListener<EventTypes, EventName>, options?: {
        once?: boolean;
    }): () => void;
    /** Unsubscribe from an event */
    un<EventName extends keyof EventTypes>(event: EventName, listener: EventListener<EventTypes, EventName>): void;
    /** Subscribe to an event only once */
    once<EventName extends keyof EventTypes>(event: EventName, listener: EventListener<EventTypes, EventName>): () => void;
    /** Clear all events */
    unAll(): void;
    /** Emit an event */
    protected emit<EventName extends keyof EventTypes>(eventName: EventName, ...args: EventTypes[EventName]): void;
}

type BasePluginEvents = {
    destroy: [];
};
type GenericPlugin = BasePlugin<BasePluginEvents, unknown>;
/** Base class for wavesurfer plugins */
declare class BasePlugin<EventTypes extends BasePluginEvents, Options> extends EventEmitter<EventTypes> {
    protected wavesurfer?: WaveSurfer;
    protected subscriptions: (() => void)[];
    protected options: Options;
    /** Create a plugin instance */
    constructor(options: Options);
    /** Called after this.wavesurfer is available */
    protected onInit(): void;
    /** Do not call directly, only called by WavesSurfer internally */
    _init(wavesurfer: WaveSurfer): void;
    /** Destroy the plugin and unsubscribe from all events */
    destroy(): void;
}

type TreeNode = {
    [key: string]: string | number | boolean | CSSStyleDeclaration | TreeNode | Node;
} & {
    xmlns?: string;
    style?: Partial<CSSStyleDeclaration>;
    textContent?: string | Node;
    children?: TreeNode;
};
declare function createElement(tagName: string, content: TreeNode & {
    xmlns: string;
}, container?: Node): SVGElement;
declare function createElement(tagName: string, content?: TreeNode, container?: Node): HTMLElement;

declare const dom_createElement: typeof createElement;
declare namespace dom {
  export { dom_createElement as createElement, createElement as default };
}

type PlayerOptions = {
    media?: HTMLMediaElement;
    mediaControls?: boolean;
    autoplay?: boolean;
    playbackRate?: number;
};
declare class Player<T extends GeneralEventTypes> extends EventEmitter<T> {
    protected media: HTMLMediaElement;
    private isExternalMedia;
    constructor(options: PlayerOptions);
    protected onMediaEvent<K extends keyof HTMLElementEventMap>(event: K, callback: (ev: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions): () => void;
    protected getSrc(): string;
    private revokeSrc;
    private canPlayType;
    protected setSrc(url: string, blob?: Blob): void;
    protected destroy(): void;
    protected setMediaElement(element: HTMLMediaElement): void;
    /** Start playing the audio */
    play(): Promise<void>;
    /** Pause the audio */
    pause(): void;
    /** Check if the audio is playing */
    isPlaying(): boolean;
    /** Jump to a specific time in the audio (in seconds) */
    setTime(time: number): void;
    /** Get the duration of the audio in seconds */
    getDuration(): number;
    /** Get the current audio position in seconds */
    getCurrentTime(): number;
    /** Get the audio volume */
    getVolume(): number;
    /** Set the audio volume */
    setVolume(volume: number): void;
    /** Get the audio muted state */
    getMuted(): boolean;
    /** Mute or unmute the audio */
    setMuted(muted: boolean): void;
    /** Get the playback speed */
    getPlaybackRate(): number;
    /** Check if the audio is seeking */
    isSeeking(): boolean;
    /** Set the playback speed, pass an optional false to NOT preserve the pitch */
    setPlaybackRate(rate: number, preservePitch?: boolean): void;
    /** Get the HTML media element */
    getMediaElement(): HTMLMediaElement;
    /** Set a sink id to change the audio output device */
    setSinkId(sinkId: string): Promise<void>;
}

type WaveSurferOptions = {
    /** Required: an HTML element or selector where the waveform will be rendered */
    container: HTMLElement | string;
    /** The height of the waveform in pixels, or "auto" to fill the container height */
    height?: number | 'auto';
    /** The width of the waveform in pixels or any CSS value; defaults to 100% */
    width?: number | string;
    /** The color of the waveform */
    waveColor?: string | string[] | CanvasGradient;
    /** The color of the progress mask */
    progressColor?: string | string[] | CanvasGradient;
    /** The color of the playpack cursor */
    cursorColor?: string;
    /** The cursor width */
    cursorWidth?: number;
    /** If set, the waveform will be rendered with bars like this: ▁ ▂ ▇ ▃ ▅ ▂ */
    barWidth?: number;
    /** Spacing between bars in pixels */
    barGap?: number;
    /** Rounded borders for bars */
    barRadius?: number;
    /** A vertical scaling factor for the waveform */
    barHeight?: number;
    /** Vertical bar alignment */
    barAlign?: 'top' | 'bottom';
    /** Minimum pixels per second of audio (i.e. the zoom level) */
    minPxPerSec?: number;
    /** Stretch the waveform to fill the container, true by default */
    fillParent?: boolean;
    /** Audio URL */
    url?: string;
    /** Pre-computed audio data, arrays of floats for each channel */
    peaks?: Array<Float32Array | number[]>;
    /** Pre-computed audio duration in seconds */
    duration?: number;
    /** Use an existing media element instead of creating one */
    media?: HTMLMediaElement;
    /** Whether to show default audio element controls */
    mediaControls?: boolean;
    /** Play the audio on load */
    autoplay?: boolean;
    /** Pass false to disable clicks on the waveform */
    interact?: boolean;
    /** Allow to drag the cursor to seek to a new position. If an object with `debounceTime` is provided instead
     * then `dragToSeek` will also be true. If `true` the default is 200ms
     */
    dragToSeek?: boolean | {
        debounceTime: number;
    };
    /** Hide the scrollbar */
    hideScrollbar?: boolean;
    /** Audio rate, i.e. the playback speed */
    audioRate?: number;
    /** Automatically scroll the container to keep the current position in viewport */
    autoScroll?: boolean;
    /** If autoScroll is enabled, keep the cursor in the center of the waveform during playback */
    autoCenter?: boolean;
    /** Decoding sample rate. Doesn't affect the playback. Defaults to 8000 */
    sampleRate?: number;
    /** Render each audio channel as a separate waveform */
    splitChannels?: Array<Partial<WaveSurferOptions> & {
        overlay?: boolean;
    }>;
    /** Stretch the waveform to the full height */
    normalize?: boolean;
    /** The list of plugins to initialize on start */
    plugins?: GenericPlugin[];
    /** Custom render function */
    renderFunction?: (peaks: Array<Float32Array | number[]>, ctx: CanvasRenderingContext2D) => void;
    /** Options to pass to the fetch method */
    fetchParams?: RequestInit;
    /** Playback "backend" to use, defaults to MediaElement */
    backend?: 'WebAudio' | 'MediaElement';
    /** Custom AudioContext to use */
    audioContext?: AudioContext;
};
declare const defaultOptions: {
    waveColor: string;
    progressColor: string;
    cursorWidth: number;
    minPxPerSec: number;
    fillParent: boolean;
    interact: boolean;
    dragToSeek: boolean;
    autoScroll: boolean;
    autoCenter: boolean;
    sampleRate: number;
};
type WaveSurferEvents = {
    /** After wavesurfer is created */
    init: [];
    /** When audio starts loading */
    load: [url: string];
    /** During audio loading */
    loading: [percent: number];
    /** When the audio has been decoded */
    decode: [duration: number];
    /** When the audio is both decoded and can play */
    ready: [duration: number];
    /** When visible waveform is drawn */
    redraw: [];
    /** When all audio channel chunks of the waveform have drawn */
    redrawcomplete: [];
    /** When the audio starts playing */
    play: [];
    /** When the audio pauses */
    pause: [];
    /** When the audio finishes playing */
    finish: [];
    /** On audio position change, fires continuously during playback */
    timeupdate: [currentTime: number];
    /** An alias of timeupdate but only when the audio is playing */
    audioprocess: [currentTime: number];
    /** When the user seeks to a new position */
    seeking: [currentTime: number];
    /** When the user interacts with the waveform (i.g. clicks or drags on it) */
    interaction: [newTime: number];
    /** When the user clicks on the waveform */
    click: [relativeX: number, relativeY: number];
    /** When the user double-clicks on the waveform */
    dblclick: [relativeX: number, relativeY: number];
    /** When the user drags the cursor */
    drag: [relativeX: number];
    /** When the user starts dragging the cursor */
    dragstart: [relativeX: number];
    /** When the user ends dragging the cursor */
    dragend: [relativeX: number];
    /** When the waveform is scrolled (panned) */
    scroll: [visibleStartTime: number, visibleEndTime: number, scrollLeft: number, scrollRight: number];
    /** When the zoom level changes */
    zoom: [minPxPerSec: number];
    /** Just before the waveform is destroyed so you can clean up your events */
    destroy: [];
    /** When source file is unable to be fetched, decoded, or an error is thrown by media element */
    error: [error: Error];
};
declare class WaveSurfer extends Player<WaveSurferEvents> {
    options: WaveSurferOptions & typeof defaultOptions;
    private renderer;
    private timer;
    private plugins;
    private decodedData;
    protected subscriptions: Array<() => void>;
    protected mediaSubscriptions: Array<() => void>;
    protected abortController: AbortController | null;
    static readonly BasePlugin: typeof BasePlugin;
    static readonly dom: typeof dom;
    /** Create a new WaveSurfer instance */
    static create(options: WaveSurferOptions): WaveSurfer;
    /** Create a new WaveSurfer instance */
    constructor(options: WaveSurferOptions);
    private updateProgress;
    private initTimerEvents;
    private initPlayerEvents;
    private initRendererEvents;
    private initPlugins;
    private unsubscribePlayerEvents;
    /** Set new wavesurfer options and re-render it */
    setOptions(options: Partial<WaveSurferOptions>): void;
    /** Register a wavesurfer.js plugin */
    registerPlugin<T extends GenericPlugin>(plugin: T): T;
    /** For plugins only: get the waveform wrapper div */
    getWrapper(): HTMLElement;
    /** For plugins only: get the scroll container client width */
    getWidth(): number;
    /** Get the current scroll position in pixels */
    getScroll(): number;
    /** Set the current scroll position in pixels */
    setScroll(pixels: number): void;
    /** Move the start of the viewing window to a specific time in the audio (in seconds) */
    setScrollTime(time: number): void;
    /** Get all registered plugins */
    getActivePlugins(): GenericPlugin[];
    private loadAudio;
    /** Load an audio file by URL, with optional pre-decoded audio data */
    load(url: string, channelData?: WaveSurferOptions['peaks'], duration?: number): Promise<void>;
    /** Load an audio blob */
    loadBlob(blob: Blob, channelData?: WaveSurferOptions['peaks'], duration?: number): Promise<void>;
    /** Zoom the waveform by a given pixels-per-second factor */
    zoom(minPxPerSec: number): void;
    /** Get the decoded audio data */
    getDecodedData(): AudioBuffer | null;
    /** Get decoded peaks */
    exportPeaks({ channels, maxLength, precision }?: {
        channels?: number | undefined;
        maxLength?: number | undefined;
        precision?: number | undefined;
    }): Array<number[]>;
    /** Get the duration of the audio in seconds */
    getDuration(): number;
    /** Toggle if the waveform should react to clicks */
    toggleInteraction(isInteractive: boolean): void;
    /** Jump to a specific time in the audio (in seconds) */
    setTime(time: number): void;
    /** Seek to a percentage of audio as [0..1] (0 = beginning, 1 = end) */
    seekTo(progress: number): void;
    /** Play or pause the audio */
    playPause(): Promise<void>;
    /** Stop the audio and go to the beginning */
    stop(): void;
    /** Skip N or -N seconds from the current position */
    skip(seconds: number): void;
    /** Empty the waveform */
    empty(): void;
    /** Set HTML media element */
    setMediaElement(element: HTMLMediaElement): void;
    /**
     * Export the waveform image as a data-URI or a blob.
     *
     * @param format The format of the exported image, can be `image/png`, `image/jpeg`, `image/webp` or any other format supported by the browser.
     * @param quality The quality of the exported image, for `image/jpeg` or `image/webp`. Must be between 0 and 1.
     * @param type The type of the exported image, can be `dataURL` (default) or `blob`.
     * @returns A promise that resolves with an array of data-URLs or blobs, one for each canvas element.
     */
    exportImage(format: string, quality: number, type: 'dataURL'): Promise<string[]>;
    exportImage(format: string, quality: number, type: 'blob'): Promise<Blob[]>;
    /** Unmount wavesurfer */
    destroy(): void;
}

export { type WaveSurferEvents, type WaveSurferOptions, WaveSurfer as default };
