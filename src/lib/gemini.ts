import { GoogleGenerativeAI } from '@google/generative-ai';
import { Side, TacticalPlan } from '../types';

export interface GenerateTacticsParams {
  side: Side;
  playersCount: number;
  objective: string;
  utility: {
    smokes: number;
    molotovs: number;
    flashes: number;
    hes: number;
  };
}

// 1. API Key retrieval (Env or LocalStorage)
export const getStoredApiKey = (): string => {
  const localKey = localStorage.getItem('cs2_gemini_api_key');
  if (localKey && localKey.trim()) return localKey.trim();

  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey !== 'your-gemini-api-key') return envKey.trim();

  return '';
};

export const setStoredApiKey = (key: string): void => {
  if (key) {
    localStorage.setItem('cs2_gemini_api_key', key.trim());
  } else {
    localStorage.removeItem('cs2_gemini_api_key');
  }
};

export const hasGeminiApiKey = (): boolean => {
  return Boolean(getStoredApiKey());
};

// 2. High-precision CS2 Tactical System Prompt
const CS2_IGL_SYSTEM_PROMPT = `
Ты — элитный капитан (In-Game Leader, IGL) и профессиональный тактический тренер тир-1 команды по Counter-Strike 2.
Твоя задача — формировать пошаговые, выверенные до секунды тактические раунды для соревновательной карты Mirage (CS2).

Ключевой контекст механик CS2:
1. Волюметрические смоки CS2 горят 18 секунд, полностью заполняют проемы, раздуваются от осколочных гранат (HE) на 3 секунды.
2. Сабтик (Subtick) обеспечивает 100% консистентность Jumpthrow.
3. Карта Mirage:
   - Зона A: Тетрис, Рампа, Дворец (Паласы), Фаербокс, Ступеньки (Stairs), Джингл (Jungle), CT Спавн (Билет), Подкова (Under Palace).
   - Зона Mid: Снайперское Окно, Коннектор, Шорт (Catwalk), Нижний/Верхний Мид, Вент (Вентиляция).
   - Зона B: B-Апартаменты, Фургон (Car/Van), Окно Маркета (Кухня), Дверь Маркета, Скамейка (Bench), Эдвард.

Встроенные раскидки в базе CS2 Tactics Lab:
- Смок на CT Спавн (Билет)
- Смок на Ступеньки (Stairs)
- Смок в Джингл (Jungle / Connector)
- Быстрый смок в Окно с T-Спавна
- Смок на Шорт / Кэт (Catwalk)
- Молотов в Файербокс (Firebox)
- Смок в Окно Маркета (Кухня Б)
- Смок в Дверь Маркета
- Молотов за Машину (Van / Car B)
- Мгновенная поп-флеш над А-Плентом
- Смок в Паласы на выбивание А (Retake)
- Глубокий молотов в B-Апартаменты (CT)

Формат ответа:
Ты ОБЯЗАН вернуть ТОЛЬКО валидный JSON (без лишнего markdown или оберток, кроме pure json) строго следующей структуры:
{
  "title": "Название тактики",
  "strategySummary": "Краткое тактическое резюме замысла (2-3 предложения)",
  "side": "T" или "CT",
  "zoneTarget": "Зона атаки/обороны (например: Mirage / Плент A)",
  "playerRoles": [
    {
      "roleName": "Название роли (например: Игрок 1 (Энтри) или Снайпер)",
      "playerIndex": 1,
      "utilityUsed": "Какие гранаты кидает (например: 1 Смок + 1 Флеш)",
      "lineupRecommendation": "Конкретная раскидка из базы",
      "assignment": "Четкая задача игрока на карте"
    }
  ],
  "timeline": [
    {
      "timing": "Тайминг раунда (например: 1:45 - 1:40)",
      "title": "Действие шага",
      "details": "Пояснение, куда смотреть и что делать"
    }
  ],
  "contingencyTip": "План 'Б', если соперник использует контр-гранаты или поджимает"
}
`;

// 3. Main Generation Function
export const generateTacticalPlan = async (
  params: GenerateTacticsParams
): Promise<{ plan: TacticalPlan; isLiveAi: boolean }> => {
  const apiKey = getStoredApiKey();

  // If no API key is set, return realistic tactical fallback
  if (!apiKey) {
    return {
      plan: generateFallbackPlan(params),
      isLiveAi: false,
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
      systemInstruction: CS2_IGL_SYSTEM_PROMPT,
    });

    const userPrompt = `
Сгенерируй детальный тактический план для CS2 Mirage:
- Сторона: ${params.side === 'T' ? 'Террористы (T - Атака)' : 'Спецназ (CT - Защита)'}
- Количество игроков: ${params.playersCount}
- Доступные гранаты в команде: Смоки: ${params.utility.smokes}, Молотовы: ${params.utility.molotovs}, Флешки: ${params.utility.flashes}, HE Осколочные: ${params.utility.hes}
- Цель раунда: ${params.objective}

Сгенерируй строго распределение ролей для ровно ${params.playersCount} игроков. Ответ должен быть только в формате JSON.
`;

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    // Clean potential markdown wrap
    const cleanedJson = responseText
      .replace(/^```json/g, '')
      .replace(/^```/g, '')
      .replace(/```$/g, '')
      .trim();

    const parsedPlan: TacticalPlan = JSON.parse(cleanedJson);
    return { plan: parsedPlan, isLiveAi: true };
  } catch (error: any) {
    console.warn('Gemini API call failed, using tactical backup generator:', error);
    return {
      plan: generateFallbackPlan(params),
      isLiveAi: false,
    };
  }
};

// 4. Fallback Tactical Generator (High accuracy CS2 tactical logic)
const generateFallbackPlan = (params: GenerateTacticsParams): TacticalPlan => {
  const { side, playersCount, objective, utility } = params;
  const isA = objective.toLowerCase().includes('a') || objective.toLowerCase().includes('а');
  const isMid = objective.toLowerCase().includes('мид') || objective.toLowerCase().includes('mid') || objective.toLowerCase().includes('окно');
  const isB = objective.toLowerCase().includes('b') || objective.toLowerCase().includes('б');

  const zone = isMid ? 'Mirage / Центр (Mid)' : isB ? 'Mirage / Плент B' : 'Mirage / Плент A';

  const defaultRoles = [
    {
      roleName: 'Игрок 1 (Энтри-фраггер / Первый контакт)',
      playerIndex: 1,
      utilityUsed: `${Math.min(1, utility.flashes)} Флеш`,
      lineupRecommendation: isA ? 'Мгновенная поп-флеш над А' : isB ? 'Молотов за Машину на B' : 'Смок в Окно с T-Спавна',
      assignment: 'Выходит первым по звуку раскидки. Проверяет ближние углы и разменивает тиммейтов.',
    },
    {
      roleName: 'Игрок 2 (Основной Раскидчик / Саппорт)',
      playerIndex: 2,
      utilityUsed: `${Math.min(1, utility.smokes)} Смок + ${Math.min(1, utility.molotovs)} Молотов`,
      lineupRecommendation: isA ? 'Смок на CT Спавн (Билет)' : isB ? 'Смок в Окно Маркета (Кухня Б)' : 'Смок на Шорт / Кэт',
      assignment: 'Отрезает дальний угол и изолирует защиту ключевым дымом. Контролирует зону заклада.',
    },
    {
      roleName: 'Игрок 3 (Второй раскидчик / Снайпер)',
      playerIndex: 3,
      utilityUsed: `${Math.max(0, Math.min(1, utility.smokes - 1))} Смок`,
      lineupRecommendation: isA ? 'Смок на Ступеньки (Stairs)' : isB ? 'Смок в Дверь Маркета' : 'Контроль прохода Коннектора',
      assignment: 'Закрывает второй вектор обзора обороны, дает инфу по ротациям соперника.',
    },
    {
      roleName: 'Игрок 4 (Люркер / Вторая волна)',
      playerIndex: 4,
      utilityUsed: `${Math.min(1, utility.flashes)} Флеш + ${Math.min(1, utility.hes)} HE`,
      lineupRecommendation: isA ? 'Контроль Паласов / Дворца' : isB ? 'Контроль Апартаментов' : 'Поджим с Коннектора',
      assignment: 'Создает шум или подкрадывается с неожиданного направления при падении дымов.',
    },
    {
      roleName: 'Игрок 5 (Плантер / Клатчер)',
      playerIndex: 5,
      utilityUsed: 'C4 Бомба / Смок в дефолт',
      lineupRecommendation: 'Установка бомбы под Тетрис / Рампу',
      assignment: 'Устанавливает бомбу под прикрытием тиммейтов и занимает закрытую позицию в пост-планте.',
    },
  ].slice(0, playersCount);

  return {
    title: `Тактика: ${objective} [${side}-Side]`,
    strategySummary: `Синхронный раунд на ${playersCount} игроков. Использование запаса утилит (${utility.smokes} смоков, ${utility.molotovs} молотовых, ${utility.flashes} флешек). Основной акцент на мгновенную изоляцию зон снайпера и синхронизацию выхода.`,
    side,
    zoneTarget: zone,
    playerRoles: defaultRoles,
    timeline: [
      {
        timing: '1:50 - 1:40',
        title: 'Занятие стартовых позиций',
        details: 'Команда рассаживается по ориентирам бросков, чекает возможный агрессивный поджим защиты.',
      },
      {
        timing: '1:38 - 1:35',
        title: 'Залповый сброс гранат (Execute)',
        details: 'По сигналу капитана бросаются смоки и выжигаются молотовыми ключевые позиции.',
      },
      {
        timing: '1:34 - 1:25',
        title: 'Вход на сайт и зачистка углов',
        details: 'Энтри занимает сайт под поп-флеш, игроки саппорта кроют выходы из коннектора и шорта.',
      },
      {
        timing: '1:20+',
        title: 'Пост-плант расстановка',
        details: 'Построение перекрестного огня и контроль таймингов разминирования.',
      },
    ],
    contingencyTip: 'В случае контр-смока или раскидки от CT в рампу/апартаменты — не наступайте в дым! Переждите 15 секунд, забайтите гранатами и продавите ослабленную точку.',
  };
};
