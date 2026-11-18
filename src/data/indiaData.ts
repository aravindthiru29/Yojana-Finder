export interface StateEntry {
  value: string;
  en: string;
  ta: string;
  hi: string;
  type: 'State' | 'UT';
}

// All 28 States + 8 Union Territories of India
export const INDIA_STATES_AND_UTS: StateEntry[] = [
  { value: 'Andhra Pradesh', en: 'Andhra Pradesh', ta: 'ஆந்திரப் பிரதேசம்', hi: 'आंध्र प्रदेश', type: 'State' },
  { value: 'Arunachal Pradesh', en: 'Arunachal Pradesh', ta: 'அருணாச்சலப் பிரதேசம்', hi: 'अरुणाचल प्रदेश', type: 'State' },
  { value: 'Assam', en: 'Assam', ta: 'அசாம்', hi: 'असम', type: 'State' },
  { value: 'Bihar', en: 'Bihar', ta: 'பீகார்', hi: 'बिहार', type: 'State' },
  { value: 'Chhattisgarh', en: 'Chhattisgarh', ta: 'சத்தீஸ்கர்', hi: 'छत्तीसगढ़', type: 'State' },
  { value: 'Goa', en: 'Goa', ta: 'கோவா', hi: 'गोवा', type: 'State' },
  { value: 'Gujarat', en: 'Gujarat', ta: 'குஜராத்', hi: 'गुजरात', type: 'State' },
  { value: 'Haryana', en: 'Haryana', ta: 'ஹரியானா', hi: 'हरियाणा', type: 'State' },
  { value: 'Himachal Pradesh', en: 'Himachal Pradesh', ta: 'இமாச்சலப் பிரதேசம்', hi: 'हिमाचल प्रदेश', type: 'State' },
  { value: 'Jharkhand', en: 'Jharkhand', ta: 'ஜார்க்கண்ட்', hi: 'झारखंड', type: 'State' },
  { value: 'Karnataka', en: 'Karnataka', ta: 'கர்நாடகா', hi: 'कर्नाटक', type: 'State' },
  { value: 'Kerala', en: 'Kerala', ta: 'கேரளா', hi: 'केरल', type: 'State' },
  { value: 'Madhya Pradesh', en: 'Madhya Pradesh', ta: 'மத்தியப் பிரதேசம்', hi: 'मध्य प्रदेश', type: 'State' },
  { value: 'Maharashtra', en: 'Maharashtra', ta: 'மகாராஷ்டிரா', hi: 'महाराष्ट्र', type: 'State' },
  { value: 'Manipur', en: 'Manipur', ta: 'மணிப்பூர்', hi: 'मणिपुर', type: 'State' },
  { value: 'Meghalaya', en: 'Meghalaya', ta: 'மேகாலயா', hi: 'मेघालय', type: 'State' },
  { value: 'Mizoram', en: 'Mizoram', ta: 'மிசோரம்', hi: 'मिज़ोरम', type: 'State' },
  { value: 'Nagaland', en: 'Nagaland', ta: 'நாகாலாந்து', hi: 'नागालैंड', type: 'State' },
  { value: 'Odisha', en: 'Odisha', ta: 'ஒடிசா', hi: 'ओडिशा', type: 'State' },
  { value: 'Punjab', en: 'Punjab', ta: 'பஞ்சாப்', hi: 'पंजाब', type: 'State' },
  { value: 'Rajasthan', en: 'Rajasthan', ta: 'ராஜஸ்தான்', hi: 'राजस्थान', type: 'State' },
  { value: 'Sikkim', en: 'Sikkim', ta: 'சிக்கிம்', hi: 'सिक्किम', type: 'State' },
  { value: 'Tamil Nadu', en: 'Tamil Nadu', ta: 'தமிழ்நாடு', hi: 'तमिलनाडु', type: 'State' },
  { value: 'Telangana', en: 'Telangana', ta: 'தெலங்கானா', hi: 'तेलंगाना', type: 'State' },
  { value: 'Tripura', en: 'Tripura', ta: 'திரிபுரா', hi: 'त्रिपुरा', type: 'State' },
  { value: 'Uttar Pradesh', en: 'Uttar Pradesh', ta: 'உத்தரப் பிரதேசம்', hi: 'उत्तर प्रदेश', type: 'State' },
  { value: 'Uttarakhand', en: 'Uttarakhand', ta: 'உத்தரகாண்ட்', hi: 'उत्तराखंड', type: 'State' },
  { value: 'West Bengal', en: 'West Bengal', ta: 'மேற்கு வங்காளம்', hi: 'पश्चिम बंगाल', type: 'State' },
  // 8 Union Territories
  { value: 'Andaman and Nicobar Islands', en: 'Andaman and Nicobar Islands', ta: 'அந்தமான் மற்றும் நிக்கோபார் தீவுகள்', hi: 'अंडमान और निकोबार द्वीप समूह', type: 'UT' },
  { value: 'Chandigarh', en: 'Chandigarh', ta: 'சண்டிகர்', hi: 'चंडीगढ़', type: 'UT' },
  { value: 'Dadra and Nagar Haveli and Daman and Diu', en: 'Dadra and Nagar Haveli and Daman and Diu', ta: 'தாத்ரா & நகர் ஹவேலி மற்றும் தாமன் & தியு', hi: 'दादरा और नगर हवेली और दमन और दीव', type: 'UT' },
  { value: 'Delhi', en: 'Delhi (NCT)', ta: 'டெல்லி', hi: 'दिल्ली (एनसीटी)', type: 'UT' },
  { value: 'Jammu and Kashmir', en: 'Jammu and Kashmir', ta: 'ஜம்மு & காஷ்மீர்', hi: 'जम्मू और कश्मीर', type: 'UT' },
  { value: 'Ladakh', en: 'Ladakh', ta: 'லடாக்', hi: 'लद्दाख', type: 'UT' },
  { value: 'Lakshadweep', en: 'Lakshadweep', ta: 'லட்சத்தீவு', hi: 'लक्षद्वीप', type: 'UT' },
  { value: 'Puducherry', en: 'Puducherry', ta: 'புதுச்சேரி', hi: 'पुदुच्चेरी', type: 'UT' },
];

export const OCCUPATIONS = [
  'farmer',
  'student',
  'daily_wage_worker',
  'street_vendor',
  'self_employed',
  'salaried',
  'unemployed',
  'homemaker',
  'senior_citizen',
  'entrepreneur',
  'other',
] as const;

export const INCOME_RANGES = [
  'below_1_lakh',
  '1_to_2_5_lakh',
  '2_5_to_5_lakh',
  '5_to_8_lakh',
  'above_8_lakh',
] as const;

export const SOCIAL_CATEGORIES = [
  'General',
  'OBC',
  'SC',
  'ST',
  'EWS',
  'Minority',
] as const;

export const EDUCATION_LEVELS = [
  'no_formal',
  'primary',
  'secondary_10th',
  'higher_secondary_12th',
  'iti_diploma',
  'graduate',
  'postgraduate',
] as const;

export const CORE_DOCUMENTS = [
  'aadhaar',
  'income_certificate',
  'caste_certificate',
  'ration_card',
  'bank_account',
] as const;
