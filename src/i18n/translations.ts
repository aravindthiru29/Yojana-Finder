import { Language, SchemeCategory } from '../types/yojana';

export interface TranslationDictionary {
  brand: string;
  nav: {
    home: string;
    findSchemes: string;
    saved: string;
    docGuide: string;
  };
  theme: {
    toLight: string;
    toDark: string;
  };
  landing: {
    eyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaResume: string;
    trustNote: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
    coverageTitle: string;
    coverageSubtitle: string;
    stats: Array<{
      value: string;
      label: string;
    }>;
  };
  wizard: {
    title: string;
    subtitle: string;
    stepOf: string;
    steps: [string, string, string, string];
    ageLabel: string;
    agePlaceholder: string;
    genderLabel: string;
    genders: {
      Female: string;
      Male: string;
      Other: string;
    };
    stateLabel: string;
    statePlaceholder: string;
    areaLabel: string;
    areas: {
      Rural: string;
      Urban: string;
    };
    occupationLabel: string;
    occupations: Record<string, string>;
    incomeLabel: string;
    incomeRanges: Record<string, string>;
    educationLabel: string;
    educationLevels: Record<string, string>;
    categoryLabel: string;
    categories: Record<string, string>;
    specialStatusLabel: string;
    specialStatuses: {
      disability: string;
      widow: string;
      bpl: string;
      pregnantOrLactating: string;
      exServiceman: string;
    };
    situationLabel: string;
    situationHint: string;
    situationPlaceholder: string;
    voiceStart: string;
    voiceStop: string;
    voiceUnsupported: string;
    voiceListening: string;
    reviewTitle: string;
    back: string;
    next: string;
    submit: string;
    resetForm: string;
    validationAge: string;
    validationState: string;
  };
  loading: {
    title: string;
    messages: string[];
  };
  results: {
    eligiblePrefix: string;
    eligibleSuffix: string;
    centralLabel: string;
    stateLabel: string;
    allLevels: string;
    allCategories: string;
    sortMatch: string;
    sortBenefit: string;
    estimatedBenefit: string;
    matchLabel: string;
    whyQualify: string;
    viewDetails: string;
    readAloud: string;
    stopReading: string;
    saveScheme: string;
    savedScheme: string;
    printPdf: string;
    shareWhatsapp: string;
    copySummary: string;
    copied: string;
    editProfile: string;
    startOver: string;
    noMatchesFilter: string;
    resetFilters: string;
    emptyTitle: string;
    emptyBody: string;
    errorTitle: string;
    retry: string;
    sourcesTitle: string;
    sourcesEmpty: string;
  };
  categories: Record<SchemeCategory, string>;
  drawer: {
    close: string;
    ministry: string;
    benefitHighlight: string;
    whyEligible: string;
    eligibilityCriteria: string;
    documentsChecklist: string;
    documentsProgress: string;
    howToApply: string;
    applyMode: string;
    applyOfficial: string;
    helpline: string;
    deadline: string;
    ongoing: string;
    tip: string;
    applyModes: {
      Online: string;
      Offline: string;
      Both: string;
    };
  };
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    thinking: string;
    quickPromptsTitle: string;
    quickPrompts: string[];
    docChipsTitle: string;
  };
  docGuide: {
    title: string;
    subtitle: string;
    stateContext: string;
    askButton: string;
    customPlaceholder: string;
    askCustom: string;
    docs: Record<
      string,
      {
        title: string;
        summary: string;
        prompt: string;
      }
    >;
  };
  saved: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyBody: string;
    findCta: string;
    remove: string;
    docsReady: string;
  };
  footer: {
    disclaimer: string;
    copyright: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    brand: 'YojanaFinder',
    nav: {
      home: 'Home',
      findSchemes: 'Find Schemes',
      saved: 'Saved',
      docGuide: 'Document Guide',
    },
    theme: {
      toLight: 'Switch to light mode',
      toDark: 'Switch to dark mode',
    },
    landing: {
      eyebrow: 'Central & All 28 States + 8 UTs',
      heroTitle: 'Find every government welfare scheme you qualify for.',
      heroSubtitle:
        'Answer a few questions about your household, occupation, and state to receive verified active schemes, document checklists, and official application steps.',
      ctaPrimary: 'Find My Schemes',
      ctaResume: 'Resume Last Profile',
      trustNote: 'Verified against official .gov.in and .nic.in portals in English, Tamil, and Hindi.',
      howItWorksTitle: 'How YojanaFinder works',
      howItWorksSubtitle: 'From profile to official portal in three straightforward steps.',
      steps: [
        {
          number: '01',
          title: 'Share your citizen profile',
          description:
            'Enter your age, state, occupation, income bracket, and household status—or speak naturally about your situation in English, Tamil, or Hindi.',
        },
        {
          number: '02',
          title: 'Live verification across active schemes',
          description:
            'We match your details against current Central Ministry and State Government welfare programmes using live search grounding.',
        },
        {
          number: '03',
          title: 'Prepare documents and apply directly',
          description:
            'Tick off required documents in your personal checklist, listen to scheme summaries read aloud, and go straight to the official .gov.in portal.',
        },
      ],
      coverageTitle: 'Built for citizens across India',
      coverageSubtitle: 'Covering major welfare categories across rural and urban households.',
      stats: [
        { value: '36', label: 'States & Union Territories covered' },
        { value: '10', label: 'Welfare sectors checked per search' },
        { value: '3', label: 'Languages with voice support' },
      ],
    },
    wizard: {
      title: 'Tell us about yourself',
      subtitle: 'All details stay in your browser and are used solely to match eligible schemes.',
      stepOf: 'Step',
      steps: ['Personal & State', 'Work & Income', 'Category & Status', 'Situation & Review'],
      ageLabel: 'Age (in years)',
      agePlaceholder: 'e.g. 34',
      genderLabel: 'Gender',
      genders: {
        Female: 'Female',
        Male: 'Male',
        Other: 'Other',
      },
      stateLabel: 'State or Union Territory',
      statePlaceholder: 'Select your State / UT',
      areaLabel: 'Residence Area',
      areas: {
        Rural: 'Rural (Village / Panchayat)',
        Urban: 'Urban (Town / City)',
      },
      occupationLabel: 'Primary Occupation',
      occupations: {
        farmer: 'Farmer / Cultivator',
        student: 'Student',
        daily_wage_worker: 'Daily Wage / Construction Worker',
        street_vendor: 'Street Vendor / Hawker',
        self_employed: 'Self-Employed / Artisan',
        salaried: 'Salaried Employee',
        unemployed: 'Unemployed / Job Seeker',
        homemaker: 'Homemaker',
        senior_citizen: 'Senior Citizen / Retired',
        entrepreneur: 'Small Business / Entrepreneur',
        other: 'Other',
      },
      incomeLabel: 'Annual Family Income',
      incomeRanges: {
        below_1_lakh: 'Below ₹1,00,000',
        '1_to_2_5_lakh': '₹1,00,000 – ₹2,50,000',
        '2_5_to_5_lakh': '₹2,50,000 – ₹5,00,000',
        '5_to_8_lakh': '₹5,00,000 – ₹8,00,000',
        above_8_lakh: 'Above ₹8,00,000',
      },
      educationLabel: 'Highest Education Level',
      educationLevels: {
        no_formal: 'No formal schooling',
        primary: 'Up to Class 8',
        secondary_10th: 'Class 10 (SSLC / Matric)',
        higher_secondary_12th: 'Class 12 (HSC / Intermediate)',
        iti_diploma: 'ITI / Polytechnic Diploma',
        graduate: 'Graduate / Bachelor Degree',
        postgraduate: 'Postgraduate & Above',
      },
      categoryLabel: 'Social Category',
      categories: {
        General: 'General',
        OBC: 'OBC',
        SC: 'SC',
        ST: 'ST',
        EWS: 'EWS',
        Minority: 'Minority',
      },
      specialStatusLabel: 'Special Status (Select any that apply)',
      specialStatuses: {
        disability: 'Person with Disability (PwD)',
        widow: 'Widow / Single Woman Head',
        bpl: 'BPL / Antyodaya Ration Card Holder',
        pregnantOrLactating: 'Pregnant or Lactating Mother',
        exServiceman: 'Ex-Serviceman / Defence Dependent',
      },
      situationLabel: 'Describe your situation (Optional)',
      situationHint: 'Add family or specific needs such as land size, children in school, housing repair, or medical need.',
      situationPlaceholder: 'Example: I am a small farmer with 2 acres of land and a daughter studying in Class 10.',
      voiceStart: 'Speak instead of typing',
      voiceStop: 'Stop listening',
      voiceUnsupported: 'Voice input is not supported in this browser.',
      voiceListening: 'Listening... speak clearly',
      reviewTitle: 'Profile Summary',
      back: 'Back',
      next: 'Continue',
      submit: 'Find My Schemes',
      resetForm: 'Reset form',
      validationAge: 'Please enter a valid age between 0 and 120.',
      validationState: 'Please select your State or Union Territory.',
    },
    loading: {
      title: 'Finding verified government schemes',
      messages: [
        'Searching active Central and State schemes for you…',
        'Verifying eligibility rules and income thresholds…',
        'Checking official .gov.in portals and benefit amounts…',
        'Preparing your required document checklists…',
        'Translating step-by-step instructions…',
      ],
    },
    results: {
      eligiblePrefix: 'You may be eligible for',
      eligibleSuffix: 'schemes',
      centralLabel: 'Central',
      stateLabel: 'State',
      allLevels: 'All Levels',
      allCategories: 'All Categories',
      sortMatch: 'Sort: Best Match',
      sortBenefit: 'Sort: Benefit Value',
      estimatedBenefit: 'Estimated combined benefit',
      matchLabel: 'Match',
      whyQualify: 'Why you qualify',
      viewDetails: 'Details & Checklist',
      readAloud: 'Read aloud',
      stopReading: 'Stop audio',
      saveScheme: 'Save',
      savedScheme: 'Saved',
      printPdf: 'Print / PDF',
      shareWhatsapp: 'WhatsApp',
      copySummary: 'Copy link & summary',
      copied: 'Copied',
      editProfile: 'Edit Profile',
      startOver: 'Start Over',
      noMatchesFilter: 'No schemes match the selected category or level filter.',
      resetFilters: 'Show all schemes',
      emptyTitle: 'No active schemes found for this exact combination',
      emptyBody: 'Try broadening your situation description or adjusting income and category filters to discover related state programmes.',
      errorTitle: 'Could not retrieve schemes right now',
      retry: 'Try Again',
      sourcesTitle: 'Verified Official & Search Sources',
      sourcesEmpty: 'Official portal links are listed directly inside each scheme card.',
    },
    categories: {
      Agriculture: 'Agriculture',
      Education: 'Education',
      Health: 'Health',
      Housing: 'Housing',
      Employment: 'Employment',
      'Women & Child': 'Women & Child',
      Pension: 'Pension',
      Business: 'Business',
      Skill: 'Skill',
      'Social Security': 'Social Security',
    },
    drawer: {
      close: 'Close panel',
      ministry: 'Ministry / Department',
      benefitHighlight: 'Scheme Benefit',
      whyEligible: 'Why you are eligible',
      eligibilityCriteria: 'Eligibility Criteria',
      documentsChecklist: 'Documents Required Checklist',
      documentsProgress: 'ready',
      howToApply: 'How to Apply',
      applyMode: 'Application Mode',
      applyOfficial: 'Apply on Official Website',
      helpline: 'Official Helpline',
      deadline: 'Last Date / Deadline',
      ongoing: 'Open throughout the year',
      tip: 'Practical Tip',
      applyModes: {
        Online: 'Online Portal',
        Offline: 'Offline Office / CSC',
        Both: 'Online & Offline (CSC)',
      },
    },
    chat: {
      title: 'Ask a follow-up question',
      subtitle: 'Ask about comparing these schemes, local CSC centres, or how to obtain any missing certificate.',
      placeholder: 'Ask e.g. "Which of these is best for me?" or "How do I get an income certificate?"',
      send: 'Ask',
      thinking: 'Checking official guidance…',
      quickPromptsTitle: 'Quick questions & document help',
      quickPrompts: [
        'Which of these schemes should I apply for first?',
        'Can I combine multiple schemes together?',
        'Where is my nearest application centre?',
      ],
      docChipsTitle: 'How to get documents:',
    },
    docGuide: {
      title: 'Essential Document Guide',
      subtitle: 'Step-by-step instructions to obtain or update foundational Indian welfare documents in your state.',
      stateContext: 'Showing procedures tailored for',
      askButton: 'Get Step-by-Step Guide',
      customPlaceholder: 'Ask about any certificate (e.g. Domicile, Disability UDID, OBC Non-Creamy Layer)…',
      askCustom: 'Ask Guide',
      docs: {
        aadhaar: {
          title: 'Aadhaar Card / Mobile Update',
          summary: 'UIDAI enrollment, mobile number linking for OTP verification, and address updates.',
          prompt: 'How do I apply for a new Aadhaar card or link/update my mobile number in Aadhaar in India?',
        },
        income_certificate: {
          title: 'Income Certificate',
          summary: 'State e-District / Tehsildar income proof required for scholarships, EWS, and subsidies.',
          prompt: 'How do I apply for an official Income Certificate in my state? Include online e-District portal, offline CSC/Taluk steps, required proofs, and fees.',
        },
        caste_certificate: {
          title: 'Caste / Community Certificate',
          summary: 'SC, ST, OBC, or EWS community verification issued by Revenue / Tahsildar authorities.',
          prompt: 'How do I apply for a Caste / Community Certificate in my state? List the official portal, supporting documents, and verification steps.',
        },
        ration_card: {
          title: 'Ration Card (NFSA / BPL)',
          summary: 'State Food & Civil Supplies family card used for PDS, housing, and health schemes.',
          prompt: 'How do I apply for a new Ration Card or add a family member in my state?',
        },
        bank_account: {
          title: 'Jan Dhan / Aadhaar-Seeded Bank Account',
          summary: 'Zero-balance PMJDY account with DBT (Direct Benefit Transfer) seeding.',
          prompt: 'How do I open a zero-balance Jan Dhan (PMJDY) bank account and ensure Aadhaar DBT seeding is active?',
        },
      },
    },
    saved: {
      title: 'Saved Schemes',
      subtitle: 'Bookmarked schemes and your saved document preparation progress.',
      emptyTitle: 'No saved schemes yet',
      emptyBody: 'Bookmark any scheme from your search results to review eligibility and track required documents here.',
      findCta: 'Find My Schemes',
      remove: 'Remove',
      docsReady: 'documents ready',
    },
    footer: {
      disclaimer:
        'Information is AI-generated and verified via search. Always confirm on the official website before applying.',
      copyright: 'YojanaFinder · Citizen Welfare Discovery',
    },
  },

  ta: {
    brand: 'YojanaFinder',
    nav: {
      home: 'முகப்பு',
      findSchemes: 'திட்டங்கள் தேடுக',
      saved: 'சேமித்தவை',
      docGuide: 'ஆவண வழிகாட்டி',
    },
    theme: {
      toLight: 'ஒளி வடிவத்திற்கு மாற்று',
      toDark: 'இருள் வடிவத்திற்கு மாற்று',
    },
    landing: {
      eyebrow: 'மத்திய அரசு & அனைத்து 28 மாநிலங்கள் + 8 யூனியன் பிரதேசங்கள்',
      heroTitle: 'நீங்கள் தகுதி பெறும் அனைத்து அரசு நலத்திட்டங்களையும் கண்டறியுங்கள்.',
      heroSubtitle:
        'உங்கள் குடும்ப விவரம், தொழில் மற்றும் மாநிலத்தை பகிர்ந்து, செயல்பாட்டில் உள்ள அரசு திட்டங்கள், தேவையான ஆவணங்கள் மற்றும் அதிகாரப்பூர்வ விண்ணப்ப முறைகளைப் பெறுங்கள்.',
      ctaPrimary: 'என் திட்டங்களைக் காண்க',
      ctaResume: 'முந்தைய விவரத்தை தொடர்க',
      trustNote: 'அதிகாரப்பூர்வ .gov.in மற்றும் .nic.in தளங்களின் அடிப்படையில் தமிழ், ஆங்கிலம், இந்தியில் சரிபார்க்கப்பட்டது.',
      howItWorksTitle: 'YojanaFinder எவ்வாறு செயல்படுகிறது',
      howItWorksSubtitle: 'உங்கள் விவரத்திலிருந்து அதிகாரப்பூர்வ விண்ணப்பம் வரை 3 எளிய படிகள்.',
      steps: [
        {
          number: '01',
          title: 'உங்கள் விவரங்களை உள்ளிடவும்',
          description:
            'வயது, மாநிலம், தொழில், வருமானம் மற்றும் சிறப்பு நிலைகளைத் தேர்ந்தெடுக்கவும் அல்லது குரல் மூலம் தமிழ், ஆங்கிலம், இந்தியில் சொல்லவும்.',
        },
        {
          number: '02',
          title: 'நடப்பு திட்டங்களை AI சரிபார்க்கும்',
          description:
            'மத்திய அமைச்சகங்கள் மற்றும் உங்கள் மாநில அரசின் தற்போதைய நலத்திட்டங்களை நேரடித் தேடலின் மூலம் பொருத்திப் பார்க்கிறோம்.',
        },
        {
          number: '03',
          title: 'ஆவணங்களை சரிபார்த்து விண்ணப்பிக்கவும்',
          description:
            'தேவையான ஆவணப் பட்டியலில் டிக் செய்து, திட்ட விவரத்தை ஒலியாகக் கேட்டு, நேரடியாக அதிகாரப்பூர்வ அரசு தளத்தில் விண்ணப்பிக்கவும்.',
        },
      ],
      coverageTitle: 'இந்தியக் குடிமக்களுக்காக உருவாக்கப்பட்டது',
      coverageSubtitle: 'கிராமப்புற மற்றும் நகர்ப்புற குடும்பங்களின் முக்கிய நலத்துறைகளை உள்ளடக்கியது.',
      stats: [
        { value: '36', label: 'மாநிலங்கள் & யூனியன் பிரதேசங்கள்' },
        { value: '10', label: 'நலத்திட்டத் துறைகள்' },
        { value: '3', label: 'குரல் வசதி கொண்ட மொழிகள்' },
      ],
    },
    wizard: {
      title: 'உங்கள் விவரங்களைப் பதிவு செய்யவும்',
      subtitle: 'இந்தத் தகவல்கள் உங்கள் உலாவியில் மட்டுமே சேமிக்கப்பட்டு பொருத்தமான திட்டங்களைக் காண பயன்படும்.',
      stepOf: 'படி',
      steps: ['தனிப்பட்ட விவரம்', 'தொழில் & வருமானம்', 'பிரிவு & நிலை', 'சூழ்நிலை & சரிபார்ப்பு'],
      ageLabel: 'வயது (ஆண்டுகளில்)',
      agePlaceholder: 'எ.கா. 34',
      genderLabel: 'பாலினம்',
      genders: {
        Female: 'பெண்',
        Male: 'ஆண்',
        Other: 'மற்றவை',
      },
      stateLabel: 'மாநிலம் அல்லது யூனியன் பிரதேசம்',
      statePlaceholder: 'மாநிலம் / யூ.பி. தேர்ந்தெடுக்கவும்',
      areaLabel: 'வசிக்கும் பகுதி',
      areas: {
        Rural: 'கிராமப்புறம் (ஊராட்சி)',
        Urban: 'நகர்ப்புறம் (நகராட்சி / மாநகராட்சி)',
      },
      occupationLabel: 'முதன்மைத் தொழில்',
      occupations: {
        farmer: 'விவசாயி',
        student: 'மாணவர்',
        daily_wage_worker: 'தினக்கூலி / கட்டுமானத் தொழிலாளர்',
        street_vendor: 'சாலையோர வியாபாரி',
        self_employed: 'சுயதொழில் / கைவினைஞர்',
        salaried: 'மாதச் சம்பள ஊழியர்',
        unemployed: 'வேலையில்லாதவர் / வேலை தேடுபவர்',
        homemaker: 'இல்லத்தரசி',
        senior_citizen: 'மூத்த குடிமகன் / ஓய்வூதியர்',
        entrepreneur: 'சிறு தொழில் முனைவோர்',
        other: 'மற்றவை',
      },
      incomeLabel: 'ஆண்டு குடும்ப வருமானம்',
      incomeRanges: {
        below_1_lakh: '₹1,00,000-க்குக் கீழ்',
        '1_to_2_5_lakh': '₹1,00,000 – ₹2,50,000',
        '2_5_to_5_lakh': '₹2,50,000 – ₹5,00,000',
        '5_to_8_lakh': '₹5,00,000 – ₹8,00,000',
        above_8_lakh: '₹8,00,000-க்கு மேல்',
      },
      educationLabel: 'உயர்ந்த கல்வித் தகுதி',
      educationLevels: {
        no_formal: 'பள்ளிப் படிப்பு இல்லை',
        primary: '8-ஆம் வகுப்பு வரை',
        secondary_10th: '10-ஆம் வகுப்பு (SSLC)',
        higher_secondary_12th: '12-ஆம் வகுப்பு (HSC)',
        iti_diploma: 'ஐடிஐ / டிப்ளமோ',
        graduate: 'இளங்கலை பட்டம்',
        postgraduate: 'முதுகலை மற்றும் அதற்கு மேல்',
      },
      categoryLabel: 'சமூகப் பிரிவு',
      categories: {
        General: 'பொதுப் பிரிவு (General)',
        OBC: 'பிற்படுத்தப்பட்டோர் (OBC / BC / MBC)',
        SC: 'பட்டியல் சாதி (SC)',
        ST: 'பழங்குடியினர் (ST)',
        EWS: 'பொருளாதாரத்தில் நலிவடைந்தோர் (EWS)',
        Minority: 'சிறுபான்மையினர் (Minority)',
      },
      specialStatusLabel: 'சிறப்பு நிலை (பொருந்துவனவற்றைத் தேர்ந்தெடுக்கவும்)',
      specialStatuses: {
        disability: 'மாற்றுத்திறனாளி (PwD)',
        widow: 'கைம்பெண் / தனித்து வாழும் பெண்',
        bpl: 'வறுமைக் கோட்டிற்குக் கீழ் (BPL / AAY ரேஷன் அட்டை)',
        pregnantOrLactating: 'கர்ப்பிணி அல்லது பாலூட்டும் தாய்',
        exServiceman: 'முன்னாள் ராணுவ வீரர் / குடும்பத்தினர்',
      },
      situationLabel: 'உங்கள் சூழ்நிலையை விவரிக்கவும் (விருப்பம்)',
      situationHint: 'நில அளவு, பிள்ளைகளின் கல்வி, வீடு அல்லது மருத்துவத் தேவை போன்ற விவரங்களை எழுதலாம்.',
      situationPlaceholder: 'எடுத்துக்காட்டு: எனக்கு 2 ஏக்கர் நிலம் உள்ளது, என் மகள் 10-ஆம் வகுப்பு படிக்கிறாள்.',
      voiceStart: 'பேசி உள்ளிடவும்',
      voiceStop: 'கேட்பதை நிறுத்து',
      voiceUnsupported: 'இந்த உலாவியில் குரல் உள்ளீடு ஆதரிக்கப்படவில்லை.',
      voiceListening: 'கேட்கிறது... தெளிவாகப் பேசுங்கள்',
      reviewTitle: 'விவரங்களின் சுருக்கம்',
      back: 'பின்செல்',
      next: 'தொடர்க',
      submit: 'திட்டங்களைக் கண்டறிக',
      resetForm: 'மீட்டமை',
      validationAge: '0 முதல் 120 வரையிலான சரியான வயதை உள்ளிடவும்.',
      validationState: 'உங்கள் மாநிலம் அல்லது யூனியன் பிரதேசத்தைத் தேர்ந்தெடுக்கவும்.',
    },
    loading: {
      title: 'சரிபார்க்கப்பட்ட அரசு திட்டங்களைத் தேடுகிறோம்',
      messages: [
        'உங்களுக்கான மத்திய & மாநில திட்டங்களைத் தேடுகிறோம்…',
        'தகுதி விதிகள் மற்றும் வருமான வரம்புகளைச் சரிபார்க்கிறோம்…',
        'அதிகாரப்பூர்வ .gov.in தளங்களில் சலுகைகளை உறுதி செய்கிறோம்…',
        'தேவையான ஆவணப் பட்டியலைத் தயார் செய்கிறோம்…',
        'தமிழில் எளிய வழிமுறைகளை உருவாக்குகிறோம்…',
      ],
    },
    results: {
      eligiblePrefix: 'நீங்கள் தகுதி பெறக்கூடிய',
      eligibleSuffix: 'திட்டங்கள்',
      centralLabel: 'மத்திய அரசு',
      stateLabel: 'மாநில அரசு',
      allLevels: 'அனைத்து நிலைகளும்',
      allCategories: 'அனைத்துப் பிரிவுகளும்',
      sortMatch: 'வரிசை: அதிக பொருத்தம்',
      sortBenefit: 'வரிசை: சலுகை மதிப்பு',
      estimatedBenefit: 'மதிப்பிடப்பட்ட மொத்த ஆண்டு சலுகை',
      matchLabel: 'பொருத்தம்',
      whyQualify: 'நீங்கள் தகுதி பெறுவதற்கான காரணம்',
      viewDetails: 'முழு விவரம் & ஆவணங்கள்',
      readAloud: 'ஒலியாகக் கேள்',
      stopReading: 'நிறுத்து',
      saveScheme: 'சேமி',
      savedScheme: 'சேமிக்கப்பட்டது',
      printPdf: 'அச்சிடு / PDF',
      shareWhatsapp: 'WhatsApp பகிர்',
      copySummary: 'இணைப்பை நகலெடு',
      copied: 'நகலெடுக்கப்பட்டது',
      editProfile: 'விவரத்தை மாற்று',
      startOver: 'புதிதாகத் தொடங்கு',
      noMatchesFilter: 'தேர்ந்தெடுத்த பிரிவில் திட்டங்கள் இல்லை.',
      resetFilters: 'அனைத்து திட்டங்களையும் காட்டு',
      emptyTitle: 'இந்த விவரங்களுக்கு நேரடித் திட்டங்கள் கிடைக்கவில்லை',
      emptyBody: 'உங்கள் சூழ்நிலை விவரத்தைச் சற்று விரிவுபடுத்தி அல்லது வருமானப் பிரிவை மாற்றி மீண்டும் தேடவும்.',
      errorTitle: 'திட்டங்களைப் பெறுவதில் சிக்கல் ஏற்பட்டது',
      retry: 'மீண்டும் முயற்சிக்கவும்',
      sourcesTitle: 'சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ ஆதாரங்கள்',
      sourcesEmpty: 'ஒவ்வொரு திட்ட அட்டையிலும் அதிகாரப்பூர்வ இணையதள இணைப்பு வழங்கப்பட்டுள்ளது.',
    },
    categories: {
      Agriculture: 'விவசாயம்',
      Education: 'கல்வி',
      Health: 'மருத்துவம்',
      Housing: 'வீட்டுவசதி',
      Employment: 'வேலைவாய்ப்பு',
      'Women & Child': 'பெண்கள் & குழந்தைகள்',
      Pension: 'ஓய்வூதியம்',
      Business: 'வணிகம் & கடன்',
      Skill: 'திறன் மேம்பாடு',
      'Social Security': 'சமூகப் பாதுகாப்பு',
    },
    drawer: {
      close: 'மூடு',
      ministry: 'அமைச்சகம் / துறை',
      benefitHighlight: 'திட்டப் பயன்',
      whyEligible: 'ஏன் தகுதி பெறுகிறீர்கள்',
      eligibilityCriteria: 'தகுதி நிபந்தனைகள்',
      documentsChecklist: 'தேவையான ஆவணங்கள் (சரிபார்ப்புப் பட்டியல்)',
      documentsProgress: 'தயார்',
      howToApply: 'விண்ணப்பிக்கும் முறை',
      applyMode: 'விண்ணப்ப முறை',
      applyOfficial: 'அதிகாரப்பூர்வ தளத்தில் விண்ணப்பிக்க',
      helpline: 'உதவி எண் (Helpline)',
      deadline: 'கடைசி தேதி',
      ongoing: 'ஆண்டு முழுவதும் விண்ணப்பிக்கலாம்',
      tip: 'முக்கிய குறிப்பு',
      applyModes: {
        Online: 'ஆன்லைன் தளம்',
        Offline: 'நேரடி அலுவலகம் / இ-சேவை மையம்',
        Both: 'ஆன்லைன் & இ-சேவை மையம்',
      },
    },
    chat: {
      title: 'மேலும் சந்தேகம் கேட்க',
      subtitle: 'இத்திட்டங்களை ஒப்பிடவோ அல்லது சான்றிதழ் பெறுவது பற்றியோ கேள்வி கேளுங்கள்.',
      placeholder: 'எ.கா. "இதில் எது எனக்கு சிறந்தது?" அல்லது "வருமானச் சான்றிதழ் எவ்வாறு பெறுவது?"',
      send: 'கேள்',
      thinking: 'அதிகாரப்பூர்வ வழிகாட்டுதலைச் சரிபார்க்கிறது…',
      quickPromptsTitle: 'விரைவு கேள்விகள் & ஆவண உதவி',
      quickPrompts: [
        'இவற்றில் முதலில் எந்தத் திட்டத்திற்கு விண்ணப்பிக்க வேண்டும்?',
        'பல திட்டங்களில் ஒரே நேரத்தில் பயன்பெற முடியுமா?',
        'அருகிலுள்ள இ-சேவை / CSC மையத்தை எவ்வாறு அணுகுவது?',
      ],
      docChipsTitle: 'ஆவணங்கள் பெறுவது எப்படி:',
    },
    docGuide: {
      title: 'அத்தியாவசிய ஆவண வழிகாட்டி',
      subtitle: 'அரசு நலத்திட்டங்களுக்குத் தேவையான முக்கிய சான்றிதழ்களை உங்கள் மாநிலத்தில் பெறும் வழிமுறைகள்.',
      stateContext: 'வழிகாட்டுதல் மாநிலம்:',
      askButton: 'படிப்படியான வழிகாட்டுதல் பெறுக',
      customPlaceholder: 'எந்தவொரு சான்றிதழ் பற்றியும் கேளுங்கள் (எ.கா. இருப்பிடச் சான்றிதழ், UDID அட்டை)…',
      askCustom: 'வழிகாட்டி கேள்',
      docs: {
        aadhaar: {
          title: 'ஆதார் அட்டை / மொபைல் எண் இணைப்பு',
          summary: 'புதிய ஆதார் பதிவு, OTP சரிபார்ப்பிற்கான மொபைல் எண் இணைப்பு மற்றும் முகவரி மாற்றம்.',
          prompt: 'இந்தியாவில் புதிய ஆதார் அட்டை பெறுவது அல்லது ஆதாரில் மொபைல் எண் இணைப்பது எப்படி?',
        },
        income_certificate: {
          title: 'வருமானச் சான்றிதழ்',
          summary: 'கல்வி உதவித்தொகை மற்றும் நலத்திட்டங்களுக்கான இ-சேவை / வட்டாட்சியர் வருமானச் சான்று.',
          prompt: 'என் மாநிலத்தில் அதிகாரப்பூர்வ வருமானச் சான்றிதழ் பெறுவது எப்படி? ஆன்லைன் தளம், இ-சேவை மையம், தேவையான ஆவணங்கள் மற்றும் கட்டண விவரம் தருக.',
        },
        caste_certificate: {
          title: 'சாதி / சமூகச் சான்றிதழ்',
          summary: 'SC, ST, OBC, EWS பிரிவுகளுக்கான வருவாய்த் துறை சமூகச் சான்றிதழ்.',
          prompt: 'என் மாநிலத்தில் சாதி / சமூகச் சான்றிதழ் எவ்வாறு விண்ணப்பித்துப் பெறுவது?',
        },
        ration_card: {
          title: 'குடும்ப அட்டை (ரேஷன் கார்டு)',
          summary: 'உணவுப் பொருள் வழங்கல், வீடு மற்றும் மருத்துவத் திட்டங்களுக்கான குடும்ப அட்டை.',
          prompt: 'என் மாநிலத்தில் புதிய ரேஷன் கார்டு பெறுவது அல்லது குடும்ப உறுப்பினர் பெயர் சேர்ப்பது எப்படி?',
        },
        bank_account: {
          title: 'ஜன் தன் / ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கு',
          summary: 'DBT நேரடிப் பணப் பரிமாற்றம் பெறும் பூஜ்ஜிய இருப்பு வங்கிக் கணக்கு.',
          prompt: 'ஜன் தன் (PMJDY) வங்கிக் கணக்கு தொடங்குவது மற்றும் ஆதார் DBT இணைப்பை உறுதி செய்வது எப்படி?',
        },
      },
    },
    saved: {
      title: 'சேமித்த திட்டங்கள்',
      subtitle: 'நீங்கள் சேமித்த நலத்திட்டங்கள் மற்றும் ஆவணத் தயாரிப்பு நிலை.',
      emptyTitle: 'சேமித்த திட்டங்கள் எதுவும் இல்லை',
      emptyBody: 'தேடல் முடிவுகளில் பிடித்த திட்டங்களைச் சேமித்தால், இங்கே எளிதாகப் பார்க்கலாம்.',
      findCta: 'திட்டங்கள் தேடுக',
      remove: 'நீக்கு',
      docsReady: 'ஆவணங்கள் தயார்',
    },
    footer: {
      disclaimer:
        'இந்தத் தகவல்கள் AI மூலம் உருவாக்கப்பட்டு இணையத் தேடலால் சரிபார்க்கப்பட்டவை. விண்ணப்பிக்கும் முன் அதிகாரப்பூர்வ அரசு இணையதளத்தில் உறுதி செய்யவும்.',
      copyright: 'YojanaFinder · குடிமக்கள் நலத்திட்டத் தேடல்',
    },
  },

  hi: {
    brand: 'YojanaFinder',
    nav: {
      home: 'होम',
      findSchemes: 'योजनाएं खोजें',
      saved: 'सहेजी गई',
      docGuide: 'दस्तावेज़ गाइड',
    },
    theme: {
      toLight: 'लाइट मोड में बदलें',
      toDark: 'डार्क मोड में बदलें',
    },
    landing: {
      eyebrow: 'केंद्र सरकार और सभी 28 राज्य + 8 केंद्र शासित प्रदेश',
      heroTitle: 'जानें कि आप किन सरकारी कल्याणकारी योजनाओं के पात्र हैं।',
      heroSubtitle:
        'अपने परिवार, व्यवसाय और राज्य की जानकारी दें और सक्रिय सरकारी योजनाओं, आवश्यक दस्तावेज़ों की सूची और आधिकारिक आवेदन प्रक्रिया की जानकारी प्राप्त करें।',
      ctaPrimary: 'मेरी योजनाएं खोजें',
      ctaResume: 'पिछली प्रोफ़ाइल जारी रखें',
      trustNote: 'आधिकारिक .gov.in और .nic.in पोर्टलों से हिन्दी, तमिल और अंग्रेज़ी में सत्यापित।',
      howItWorksTitle: 'YojanaFinder कैसे काम करता है',
      howItWorksSubtitle: 'आपकी प्रोफ़ाइल से आधिकारिक पोर्टल तक तीन सरल चरण।',
      steps: [
        {
          number: '01',
          title: 'अपनी जानकारी साझा करें',
          description:
            'आयु, राज्य, व्यवसाय, आय और विशेष स्थिति चुनें—या हिन्दी, तमिल या अंग्रेज़ी में बोलकर अपनी स्थिति बताएं।',
        },
        {
          number: '02',
          title: 'सक्रिय योजनाओं का लाइव सत्यापन',
          description:
            'हम लाइव सर्च के माध्यम से केंद्र और आपके राज्य की वर्तमान कल्याणकारी योजनाओं से आपकी पात्रता का मिलान करते हैं।',
        },
        {
          number: '03',
          title: 'दस्तावेज़ तैयार करें और आवेदन करें',
          description:
            'दस्तावेज़ चेकलिस्ट पर टिक करें, योजना का विवरण सुनें और सीधे आधिकारिक .gov.in पोर्टल पर आवेदन करें।',
        },
      ],
      coverageTitle: 'भारत के हर नागरिक के लिए निर्मित',
      coverageSubtitle: 'ग्रामीण और शहरी परिवारों के लिए प्रमुख कल्याणकारी क्षेत्रों को शामिल करता है।',
      stats: [
        { value: '36', label: 'राज्य एवं केंद्र शासित प्रदेश' },
        { value: '10', label: 'कल्याणकारी श्रेणियां' },
        { value: '3', label: 'वॉइस सपोर्ट वाली भाषाएं' },
      ],
    },
    wizard: {
      title: 'अपनी जानकारी दर्ज करें',
      subtitle: 'आपका विवरण केवल आपके ब्राउज़र में रहता है और पात्र योजनाएं खोजने के लिए उपयोग होता है।',
      stepOf: 'चरण',
      steps: ['व्यक्तिगत व राज्य', 'कार्य व आय', 'श्रेणी व स्थिति', 'स्थिति व समीक्षा'],
      ageLabel: 'आयु (वर्षों में)',
      agePlaceholder: 'जैसे 34',
      genderLabel: 'लिंग',
      genders: {
        Female: 'महिला',
        Male: 'पुरुष',
        Other: 'अन्य',
      },
      stateLabel: 'राज्य या केंद्र शासित प्रदेश',
      statePlaceholder: 'अपना राज्य / यू.टी. चुनें',
      areaLabel: 'निवास क्षेत्र',
      areas: {
        Rural: 'ग्रामीण (गांव / पंचायत)',
        Urban: 'शहरी (कस्बा / नगर)',
      },
      occupationLabel: 'मुख्य व्यवसाय',
      occupations: {
        farmer: 'किसान',
        student: 'छात्र / छात्रा',
        daily_wage_worker: 'दैनिक मजदूर / निर्माण श्रमिक',
        street_vendor: 'रेहड़ी-पटरी विक्रेता',
        self_employed: 'स्वरोजगार / कारीगर',
        salaried: 'वेतनभोगी कर्मचारी',
        unemployed: 'बेरोजगार / नौकरी की तलाश',
        homemaker: 'गृहिणी',
        senior_citizen: 'वरिष्ठ नागरिक / सेवानिवृत्त',
        entrepreneur: 'लघु उद्यमी / व्यापारी',
        other: 'अन्य',
      },
      incomeLabel: 'वार्षिक पारिवारिक आय',
      incomeRanges: {
        below_1_lakh: '₹1,00,000 से कम',
        '1_to_2_5_lakh': '₹1,00,000 – ₹2,50,000',
        '2_5_to_5_lakh': '₹2,50,000 – ₹5,00,000',
        '5_to_8_lakh': '₹5,00,000 – ₹8,00,000',
        above_8_lakh: '₹8,00,000 से अधिक',
      },
      educationLabel: 'उच्चतम शैक्षिक योग्यता',
      educationLevels: {
        no_formal: 'औपचारिक शिक्षा नहीं',
        primary: 'कक्षा 8 तक',
        secondary_10th: 'कक्षा 10 (मैट्रिक)',
        higher_secondary_12th: 'कक्षा 12 (इंटरमीडिएट)',
        iti_diploma: 'आईटीआई / डिप्लोमा',
        graduate: 'स्नातक (ग्रेजुएट)',
        postgraduate: 'स्नातकोत्तर एवं अधिक',
      },
      categoryLabel: 'सामाजिक श्रेणी',
      categories: {
        General: 'सामान्य (General)',
        OBC: 'अन्य पिछड़ा वर्ग (OBC)',
        SC: 'अनुसूचित जाति (SC)',
        ST: 'अनुसूचित जनजाति (ST)',
        EWS: 'आर्थिक रूप से कमजोर (EWS)',
        Minority: 'अल्पसंख्यक (Minority)',
      },
      specialStatusLabel: 'विशेष स्थिति (जो लागू हो चुनें)',
      specialStatuses: {
        disability: 'दिव्यांगजन (PwD)',
        widow: 'विधवा / एकल महिला',
        bpl: 'बीपीएल / अंत्योदय राशन कार्ड धारक',
        pregnantOrLactating: 'गर्भवती या स्तनपान कराने वाली माता',
        exServiceman: 'भूतपूर्व सैनिक / आश्रित',
      },
      situationLabel: 'अपनी स्थिति बताएं (वैकल्पिक)',
      situationHint: 'भूमि का आकार, बच्चों की पढ़ाई, आवास मरम्मत या चिकित्सा आवश्यकता जैसी जानकारी लिखें।',
      situationPlaceholder: 'उदाहरण: मैं 2 एकड़ जमीन वाला छोटा किसान हूँ और मेरी बेटी कक्षा 10 में पढ़ती है।',
      voiceStart: 'बोलकर लिखें',
      voiceStop: 'सुनना बंद करें',
      voiceUnsupported: 'इस ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है।',
      voiceListening: 'सुन रहा हूँ... स्पष्ट बोलें',
      reviewTitle: 'प्रोफ़ाइल सारांश',
      back: 'पीछे',
      next: 'आगे बढ़ें',
      submit: 'योजनाएं खोजें',
      resetForm: 'रीसेट करें',
      validationAge: 'कृपया 0 से 120 के बीच सही आयु दर्ज करें।',
      validationState: 'कृपया अपना राज्य या केंद्र शासित प्रदेश चुनें।',
    },
    loading: {
      title: 'सत्यापित सरकारी योजनाएं खोज रहे हैं',
      messages: [
        'आपके लिए केंद्र और राज्य की योजनाएं खोज रहे हैं…',
        'पात्रता नियम और आय सीमा की जांच हो रही है…',
        'आधिकारिक .gov.in पोर्टलों से लाभ राशि सत्यापित कर रहे हैं…',
        'आवश्यक दस्तावेज़ चेकलिस्ट तैयार हो रही है…',
        'हिन्दी में आवेदन चरण तैयार किए जा रहे हैं…',
      ],
    },
    results: {
      eligiblePrefix: 'आप',
      eligibleSuffix: 'योजनाओं के पात्र हो सकते हैं',
      centralLabel: 'केंद्र',
      stateLabel: 'राज्य',
      allLevels: 'सभी स्तर',
      allCategories: 'सभी श्रेणियां',
      sortMatch: 'क्रम: सर्वाधिक उपयुक्त',
      sortBenefit: 'क्रम: लाभ मूल्य',
      estimatedBenefit: 'अनुमानित कुल वार्षिक लाभ',
      matchLabel: 'पात्रता',
      whyQualify: 'आप क्यों पात्र हैं',
      viewDetails: 'विवरण व दस्तावेज़',
      readAloud: 'सुनें',
      stopReading: 'रोकें',
      saveScheme: 'सहेजें',
      savedScheme: 'सहेजी गई',
      printPdf: 'प्रिंट / PDF',
      shareWhatsapp: 'WhatsApp',
      copySummary: 'लिंक कॉपी करें',
      copied: 'कॉपी हो गया',
      editProfile: 'प्रोफ़ाइल बदलें',
      startOver: 'फिर से शुरू करें',
      noMatchesFilter: 'चुनी गई श्रेणी में कोई योजना नहीं मिली।',
      resetFilters: 'सभी योजनाएं दिखाएं',
      emptyTitle: 'इस प्रोफ़ाइल के लिए कोई सक्रिय योजना नहीं मिली',
      emptyBody: 'संबंधित राज्य योजनाएं देखने के लिए स्थिति विवरण या आय श्रेणी को थोड़ा संशोधित करके पुनः प्रयास करें।',
      errorTitle: 'योजनाएं लोड करने में समस्या आई',
      retry: 'पुनः प्रयास करें',
      sourcesTitle: 'सत्यापित आधिकारिक व खोज स्रोत',
      sourcesEmpty: 'प्रत्येक योजना कार्ड में आधिकारिक वेबसाइट का लिंक दिया गया है।',
    },
    categories: {
      Agriculture: 'कृषि',
      Education: 'शिक्षा',
      Health: 'स्वास्थ्य',
      Housing: 'आवास',
      Employment: 'रोजगार',
      'Women & Child': 'महिला एवं बाल',
      Pension: 'पेंशन',
      Business: 'व्यापार व ऋण',
      Skill: 'कौशल विकास',
      'Social Security': 'सामाजिक सुरक्षा',
    },
    drawer: {
      close: 'बंद करें',
      ministry: 'मंत्रालय / विभाग',
      benefitHighlight: 'योजना का लाभ',
      whyEligible: 'आप क्यों पात्र हैं',
      eligibilityCriteria: 'पात्रता मानदंड',
      documentsChecklist: 'आवश्यक दस्तावेज़ चेकलिस्ट',
      documentsProgress: 'तैयार',
      howToApply: 'आवेदन कैसे करें',
      applyMode: 'आवेदन माध्यम',
      applyOfficial: 'आधिकारिक वेबसाइट पर आवेदन करें',
      helpline: 'आधिकारिक हेल्पलाइन',
      deadline: 'अंतिम तिथि',
      ongoing: 'वर्ष भर खुला रहता है',
      tip: 'व्यावहारिक सुझाव',
      applyModes: {
        Online: 'ऑनलाइन पोर्टल',
        Offline: 'ऑफलाइन कार्यालय / CSC',
        Both: 'ऑनलाइन व ऑफलाइन (CSC)',
      },
    },
    chat: {
      title: 'अगला प्रश्न पूछें',
      subtitle: 'इन योजनाओं की तुलना करने या आवश्यक प्रमाणपत्र बनवाने के बारे में पूछें।',
      placeholder: 'जैसे "मेरे लिए कौन सी योजना सबसे बेहतर है?" या "आय प्रमाण पत्र कैसे बनवाएं?"',
      send: 'पूछें',
      thinking: 'आधिकारिक जानकारी जांच रहा हूँ…',
      quickPromptsTitle: 'त्वरित प्रश्न व दस्तावेज़ सहायता',
      quickPrompts: [
        'मुझे सबसे पहले किस योजना के लिए आवेदन करना चाहिए?',
        'क्या मैं एक साथ कई योजनाओं का लाभ ले सकता हूँ?',
        'मेरा नजदीकी CSC / जन सेवा केंद्र कहाँ मिलेगा?',
      ],
      docChipsTitle: 'दस्तावेज़ कैसे बनवाएं:',
    },
    docGuide: {
      title: 'आवश्यक दस्तावेज़ गाइड',
      subtitle: 'अपने राज्य में प्रमुख सरकारी प्रमाणपत्र बनवाने या अपडेट कराने की चरणबद्ध प्रक्रिया।',
      stateContext: 'दिखाई जा रही प्रक्रिया राज्य:',
      askButton: 'चरणबद्ध गाइड देखें',
      customPlaceholder: 'किसी भी प्रमाणपत्र के बारे में पूछें (जैसे निवास प्रमाण पत्र, UDID कार्ड)…',
      askCustom: 'गाइड पूछें',
      docs: {
        aadhaar: {
          title: 'आधार कार्ड / मोबाइल अपडेट',
          summary: 'नया आधार नामांकन, OTP के लिए मोबाइल नंबर लिंक करना और पता अपडेट।',
          prompt: 'भारत में नया आधार कार्ड कैसे बनवाएं या आधार में मोबाइल नंबर कैसे लिंक/अपडेट करें?',
        },
        income_certificate: {
          title: 'आय प्रमाण पत्र (Income Certificate)',
          summary: 'छात्रवृत्ति, EWS और सब्सिडी के लिए ई-डिस्ट्रिक्ट / तहसीलदार द्वारा जारी आय प्रमाण।',
          prompt: 'मेरे राज्य में आधिकारिक आय प्रमाण पत्र कैसे बनवाएं? ऑनलाइन ई-डिस्ट्रिक्ट पोर्टल, CSC प्रक्रिया, दस्तावेज़ और शुल्क बताएं।',
        },
        caste_certificate: {
          title: 'जाति प्रमाण पत्र (Caste Certificate)',
          summary: 'SC, ST, OBC या EWS वर्ग के लिए राजस्व / तहसीलदार कार्यालय से जारी प्रमाण पत्र।',
          prompt: 'मेरे राज्य में जाति प्रमाण पत्र के लिए ऑनलाइन और ऑफलाइन आवेदन कैसे करें?',
        },
        ration_card: {
          title: 'राशन कार्ड (NFSA / BPL)',
          summary: 'खाद्य एवं रसद विभाग का पारिवारिक कार्ड जो आवास व स्वास्थ्य योजनाओं में भी मान्य है।',
          prompt: 'मेरे राज्य में नया राशन कार्ड कैसे बनवाएं या परिवार के सदस्य का नाम कैसे जोड़ें?',
        },
        bank_account: {
          title: 'जन धन / आधार-लिंक्ड बैंक खाता',
          summary: 'DBT (प्रत्यक्ष लाभ अंतरण) से जुड़ा शून्य-बैलेंस PMJDY खाता।',
          prompt: 'शून्य-बैलेंस जन धन (PMJDY) बैंक खाता कैसे खोलें और आधार DBT सीडिंग कैसे सक्रिय करें?',
        },
      },
    },
    saved: {
      title: 'सहेजी गई योजनाएं',
      subtitle: 'आपकी बुकमार्क की गई योजनाएं और दस्तावेज़ तैयारी की स्थिति।',
      emptyTitle: 'अभी कोई योजना सहेजी नहीं गई है',
      emptyBody: 'खोज परिणामों में से किसी भी योजना को बुकमार्क करें ताकि आप उसे बाद में यहाँ देख सकें।',
      findCta: 'योजनाएं खोजें',
      remove: 'हटाएं',
      docsReady: 'दस्तावेज़ तैयार',
    },
    footer: {
      disclaimer:
        'यह जानकारी AI द्वारा तैयार और वेब खोज द्वारा सत्यापित है। आवेदन करने से पहले हमेशा आधिकारिक वेबसाइट पर पुष्टि करें।',
      copyright: 'YojanaFinder · नागरिक कल्याण योजना खोज',
    },
  },
};
