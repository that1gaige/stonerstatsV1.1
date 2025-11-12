import { ImageSourcePropType } from 'react-native';
import { Strain, StrainType } from '@/types';

export const ICON_INDICA: ImageSourcePropType = require('@/assets/images/iconindica.png');
export const ICON_SATIVA: ImageSourcePropType = require('@/assets/images/iconsativa.png');
export const ICON_HYBRID_A: ImageSourcePropType = require('@/assets/images/iconhybrid.png');
export const ICON_HYBRID_B: ImageSourcePropType = require('@/assets/images/iconhybrid2.png');

export function pickHybridIcon(seed: string): ImageSourcePropType {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash % 2 === 0 ? ICON_HYBRID_A : ICON_HYBRID_B;
}

export function getStrainIcon(strain: Strain): ImageSourcePropType {
  switch (strain.type) {
    case 'indica':
      return ICON_INDICA;
    case 'sativa':
      return ICON_SATIVA;
    case 'hybrid':
      return pickHybridIcon(strain.icon_seed || strain.name);
  }
}

export function getStrainIconByType(type: StrainType, seed: string = ''): ImageSourcePropType {
  switch (type) {
    case 'indica':
      return ICON_INDICA;
    case 'sativa':
      return ICON_SATIVA;
    case 'hybrid':
      return pickHybridIcon(seed);
  }
}
