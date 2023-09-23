import { ValueReference } from "../../types/types";

export function buildValueReferences(rawValues: string, viewerValues: ValueReference[] | null): ValueReference[] {
  
    let values: ValueReference[] = [];
  
    rawValues.split(",").forEach((rawValue) => {
  
      const displayValue = rawValue.trim();
  
      // normalize by removing all whitespace and converting to lowercase
      const normalizedValue = displayValue.replace(/\s+/g, '').toLowerCase();
  
      // ignore any empty values
      if (normalizedValue.length > 0) {
  
        let sharedWithViewer : boolean;
        if (!viewerValues) {
          sharedWithViewer = false;
        } else {
          const matchingValue = viewerValues.find((viewerValue) => {
            return viewerValue.normalizedValue === normalizedValue;
          });
  
          sharedWithViewer = matchingValue !== undefined;
        }
  
        if (values.find((value) => {
          return value.normalizedValue === normalizedValue;
        })) {
          // ignore duplicate values
        } else {
          values.push({
            displayValue: displayValue,
            normalizedValue: normalizedValue,
            sharedWithViewer: sharedWithViewer
          });
        }
      }
  
    });
  
    // put the values in alphabetical order, with the values shared with the viewer first
    return values.sort((a, b) => {
      if (a.sharedWithViewer && b.sharedWithViewer) {
        return a.normalizedValue.localeCompare(b.normalizedValue);
      } else if (a.sharedWithViewer) {
        return -1;
      } else if (b.sharedWithViewer) {
        return 1;
      } else {
        return a.normalizedValue.localeCompare(b.normalizedValue);
      }
    });
  }