interface ScreenDetailedEventMap {
  change: Event;
}

interface ScreenDetailed extends Screen {
  readonly availLeft: number;
  readonly avaiTop: number;
  readonly devicePixelRatio: number;

  readonly isInternal: boolean;
  readonly isPrimary: boolean;
  readonly top: number;
  readonly left: number;
  readonly label: string;
}

declare var ScreenDetaile: {
  prototype: ScreenDetailed;
  new (): ScreenDetailed;
};

interface ScreenDetailsEventMap {
  screenschange: Event;
  currentscreenchange: Event;
}

interface ScreenDetails extends EventTarget {
  readonly screens: ReadonlyArray<ScreenDetailed>;
  readonly currentScreen: ScreenDetailed;
  onscreenschange: ((this: ScreenDetails, ev: Event) => any) | null;
  oncurrentscreenchange: ((this: ScreenDetails, ev: Event) => any) | null;

  addEventListener<K extends keyof ScreenDetailsEventMap>(
    type: K,
    listener: (this: ScreenDetails, ev: ScreenDetailsEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof ScreenDetailsEventMap>(
    type: K,
    listener: (this: ScreenDetails, ev: ScreenDetailsEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare var ScreenDetails: {
  prototype: ScreenDetails;
  new (): ScreenDetails;
};

interface Window {
  getScreenDetails(): Promise<ScreenDetails>;
}

interface FullascreenOptions {
  screen?: ScreenDetailed;
}

interface ScreenEventMap {
  change: Event;
}

interface Screen {
  readonly isExtended: boolean;
  onchange: ((this: Screen, ev: Event) => any) | null;
  addEventListener<K extends keyof ScreenEventMap>(
    type: K,
    listener: (this: Screen, ev: ScreenEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof ScreenEventMap>(
    type: K,
    listener: (this: Screen, ev: ScreenEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}
