export function getEnumDescriptions(enumerator: any) {
  return Object.keys(enumerator).filter((item) => {
    return isNaN(Number(item));
  });
}
