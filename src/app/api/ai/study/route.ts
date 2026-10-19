import { NextRequest, NextResponse } from 'next/server';
import { queryAIStudyAssistant } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, surahContext, ayahContext, language, customApiKey, modelName } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
    }

    const result = await queryAIStudyAssistant({
      query: query.trim(),
      surahContext: surahContext ? Number(surahContext) : undefined,
      ayahContext: ayahContext ? Number(ayahContext) : undefined,
      language: language === 'bn' ? 'bn' : 'en',
      customApiKey: typeof customApiKey === 'string' ? customApiKey.trim() : undefined,
      modelName: typeof modelName === 'string' ? modelName.trim() : undefined
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('AI Study API Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Internal AI service error' },
      { status: 500 }
    );
  }
}
