// HACK: Copied this from txml.d.ts. Why is this needed?
export default interface TxmlNode {
  tagName: string;
  attributes: object;
  children: (TxmlNode | string)[];
}
