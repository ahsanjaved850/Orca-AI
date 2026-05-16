import * as StoreReview from "expo-store-review";

export const requestAppReview = async () => {
  const isAvailable = await StoreReview.isAvailableAsync();

  if (!isAvailable) {
    return;
  }

  const hasAction = await StoreReview.hasAction();

  if (hasAction) {
    await StoreReview.requestReview();
  }
};
