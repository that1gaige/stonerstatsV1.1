import { ImageSourcePropType } from 'react-native';
import { Strain, StrainType } from '@/types';

export const ICON_INDICA: ImageSourcePropType = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/b0rzokw1n2ou00jpb8ngc' };
export const ICON_SATIVA: ImageSourcePropType = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/r1a12ne3p1k7fkl3bfcwj' };
export const ICON_HYBRID_A: ImageSourcePropType = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/cd3gor88alhxqtq123lkm' };
export const ICON_HYBRID_B: ImageSourcePropType = { uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/gsep41og3mbezaw5sda6h' };

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
