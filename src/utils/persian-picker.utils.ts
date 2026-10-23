import {
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { toPersianDigits } from "./numbers.utils";

export function persianizePickerContent(node: ReactNode): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return toPersianDigits(String(node));
  }

  if (Array.isArray(node)) {
    return node.map(persianizePickerContent);
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return cloneElement(
      node as ReactElement<{ children?: ReactNode }>,
      undefined,
      persianizePickerContent(node.props.children),
    );
  }

  return node;
}
