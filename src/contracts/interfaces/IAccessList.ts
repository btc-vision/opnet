/**
 * @description This interface represents an access list item.
 * @interface IAccessListItem
 * @category AccessList
 */
export interface IAccessListItem {
    [key: string]: string;
}

/**
 * @description This interface represents an access list.
 * @interface IAccessList
 * @category AccessList
 */
export interface IAccessList {
    [key: string]: IAccessListItem;
}
