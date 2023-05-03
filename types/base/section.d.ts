import { Component } from '@base/component';
import { TCoreContainer, TSection } from '@base/constants/types';
/**
 * A Section Class is defined as the parent container of one or more
 * components. A section is not identified by a section tag, but is primarily
 * the top most parent container with an id attribute or by the top most parent
 * container of an element(component) with an id attribute.
 */
export declare class Section extends Component {
    sectionElements: TSection;
    private _theme;
    /**
     * subclassing Component -> CoreElement.
     * @param elementID the indentifier to search for marking the top-most
     * container which indicates to the app is a valid section.
     */
    constructor(elementID?: string);
    /**
     * !required to override the setter while strict-true
     * gets a complex data structure of TCoreContainer which contains
     * head:HTMLElement, children: HTMLElement[].
     */
    get container(): TCoreContainer;
    /**
     * Sets the complex data structure or takes a string that gets passed to the
     * superclass setter that handles defining the TCoreContainer.
     * Identifies all sectionElements which are children thart have an ID tag.
     *
     * !Elemnts with ID tags should be treated as components, however, as far
     * !as sections are concerned, components can do whatever they like, sections
     * !only think of components as nested containers(descendants) with a higher
     * !level of purpose that contril their own functionality across their own
     * !children.
     */
    set container(val: TCoreContainer | string);
    /**
     * Check for all elements that have an id attribute. The first element found
     * is treated as the head element. Any additional elements found are treated
     * as containers even if they are in fact additional components.
     * @returns A complex data structure that includes the head element
     * (TSectionItem) and any aidditional children as an optional data
     * type of TSectionItem.
     */
    protected getContainersWithID(): TSection;
    /**
     * Takes a search key and checks if it exists as an attribute on the passed
     * element(parent). If it exists, the parent and the id are pushed into the
     * array. If the search key returns multiple items, they also get pushed into
     * the array.
     * !we know the first item of this array will be head, anything additional
     * !will be considered as children.
     * @param container the element that is searched for an attribute at its
     * top-most level of the element's children.
     * @param search an attribute on the element tag.
     * @returns a data structure that is made up on an identifier and HTMLElement
     * pair.
     */
    private getElementsWithAttribute;
}
