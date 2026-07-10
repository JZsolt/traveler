import type { SectionConfig, SectionKey } from '../src/types/apiServer';
import { listSectionConfigs } from './_section-configs-list';
import { daySectionConfigs } from './_section-configs-day';

export const VALID_SECTIONS: SectionKey[] = [
  'packingList',
  'usefulLinks',
  'savingTips',
  'practicalInfo',
  'bookingChecklist',
  'day',
  'scheduleItemGuide',
  'scheduleItem',
];

export const SECTION_CONFIG: Record<SectionKey, SectionConfig> = {
  ...listSectionConfigs,
  ...daySectionConfigs,
};
