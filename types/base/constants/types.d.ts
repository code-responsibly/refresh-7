export declare type GuardKeys = 'HTMLElement' | 'Element' | 'string';
export declare enum HTML_TAGS {
    BODY = "body",
    SVG = "svg",
    HEADER = "header",
    SECTION = "section"
}
export declare enum SectionKeys {
    HOME = "home",
    ABOUT = "hello",
    DOWNLOAD_ME = "download-codebase",
    RULES = "leadership-philosophy",
    SPORTS_SCIENCE = "sports-science-analytics",
    PERSONALS = "the-personals",
    WORK_HISTORY = "career-path"
}
export declare enum SITE_STATE {
    DESKTOP = "desktop",
    NOT_DESKTOP = "not-desktop",
    NONE = ""
}
export interface TAnimationProperties {
    [animationSelector: string]: string;
}
export interface TSiteConfig {
    SITE_MODE: SITE_STATE;
}
export declare const SITE_CONFIG: TSiteConfig;
export interface TActiveSection {
    name: SectionKeys;
    scrollPercentage: number;
}
export declare type TClass<T> = new (...args: unknown[]) => T;
export interface TCoreContainer {
    head: HTMLElement;
    children?: HTMLElement[];
}
export interface TSectionItem {
    id: string;
    element: HTMLElement;
}
export interface TSection {
    head: TSectionItem;
    children?: TSectionItem[];
}
export interface TSectionValues {
    parent: HTMLElement;
    head: TSectionItem;
    children: TSectionItem[] | undefined;
    theme: string;
}
export interface TThemeSeries {
    head: HTMLElement;
    theme: string;
}
export declare enum WEB_EVENT_TYPES {
    ON_BEFORE_UNLOAD = "onbeforeunload",
    SCROLL = "scroll",
    RESIZE = "resize",
    MOUSE_MOVE = "mousemove",
    MOUSE_ENTER = "mouseenter",
    MOUSE_OUT = "mouseout",
    MOUSE_OVER = "mouseover",
    MOUSE_LEAVE = "mouseleave",
    CLICK = "click",
    OPEN_MENU = "open-menu",
    ANIMATION_ENDED = "animationend",
    TRANSITION_RUN = "transitionrun",
    TRANSITION_END = "transitionend",
    WHEEL = "wheel",
    TOUCH_START = "touchstart",
    TOUCH_MOVE = "touchmove"
}
