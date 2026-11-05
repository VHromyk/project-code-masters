type CardLimitParams = {
  mobileLimit: number;
  desktopLimit: number;
};

const thresholdWidth = 767;

export function cardLimit({ mobileLimit, desktopLimit }: CardLimitParams): number {
  return window.matchMedia(`(max-width: ${thresholdWidth}px)`).matches ? mobileLimit : desktopLimit;
}