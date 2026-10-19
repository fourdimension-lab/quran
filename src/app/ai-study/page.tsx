import React from 'react';
import { AIChatAssistant } from '@/components/ai/AIChatAssistant';

export const metadata = {
  title: 'AI Quran Study Assistant | Grounded Islamic Exegesis',
  description: 'Ask questions grounded in authentic Quranic verses, classical exegeses, and verified scholarly citations.'
};

export default function AIStudyPage() {
  return <AIChatAssistant />;
}
