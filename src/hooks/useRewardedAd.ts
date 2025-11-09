import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { ADMOB_IDS } from '../types';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : Platform.OS === 'ios'
  ? ADMOB_IDS.ios.rewarded
  : ADMOB_IDS.android.rewarded;

export const useRewardedAd = (onRewarded?: () => void) => {
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ad = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubscribeLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      (reward) => {
        if (onRewarded) {
          onRewarded();
        }
      }
    );

    const unsubscribeClosed = ad.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        ad.load(); // Reload ad after it's closed
      }
    );

    ad.load();
    setRewarded(ad);

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  }, [onRewarded]);

  const show = () => {
    if (loaded && rewarded) {
      rewarded.show();
    }
  };

  return { show, loaded };
};
