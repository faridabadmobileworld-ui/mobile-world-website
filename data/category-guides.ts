export const categoryGuides = {
  smartphones: {
    title: 'Mobile Phones in Jawahar Colony, NIT Faridabad', heading: 'अपना अगला phone, समझकर चुनिए।',
    description: 'Mobile World, Jawahar Colony में smartphones देखिए। Brand, इस्तेमाल और पसंद के अनुसार models समझिए; exchange, EMI और दुकान का रास्ता जानिए।',
    intro: 'Camera, रोज़ की apps, पढ़ाई या काम—phone चुनने की शुरुआत आपकी ज़रूरत से होती है। Mobile World पर अपनी पसंद के brands और models देखिए, shortlist बनाइए और दुकान आने से पहले उपलब्धता पूछ लीजिए।',
    points: ['Camera के लिए photo और video samples साथ में देखिए; केवल megapixels से फैसला नहीं होता।', 'Storage में आपकी photos, videos और apps के लिए जगह होनी चाहिए। RAM और storage अलग चीज़ें हैं।', 'Display, weight और grip को दुकान पर हाथ में लेकर समझिए। उपलब्ध demo की पुष्टि पहले कर लीजिए।', 'Software updates की घोषित अवधि launch से गिनी जाती है; model और region की policy देखिए।'],
    faq: [['क्या website की list live stock है?', 'यह product guide है। Colour, RAM/storage और दुकान पर मौजूद stock की पुष्टि team से कीजिए।'], ['पुराना phone exchange हो सकता है?', 'दुकान पर phone की condition और जाँच के बाद exchange value बताई जाती है। आने से पहले backup और accounts की तैयारी समझ लीजिए।'], ['Warranty कौन देता है?', 'Warranty संबंधित brand की terms के अनुसार होती है। Mobile World की team खरीदारी के बाद जानकारी और मार्गदर्शन में मदद करती है।']],
  },
  'laptops-tablets': {
    title: 'Laptops & Tablets in NIT Faridabad', heading: 'पढ़ाई और काम के लिए सही साथी।',
    description: 'Jawahar Colony, NIT Faridabad में laptop और tablet selection की मदद। इस्तेमाल, processor, RAM, storage और portability समझिए; Mobile World से संपर्क कीजिए।',
    intro: 'Online classes, office documents, coding या creative work—हर काम के लिए एक ही laptop सही नहीं होता। अपनी apps और इस्तेमाल बताइए, ताकि खरीदने से पहले जरूरी फर्क समझ सकें। Tablet चुनते समय keyboard, stylus और आपकी apps की compatibility भी देखिए।',
    points: ['जिन apps का इस्तेमाल करेंगे उनकी requirements पहले देखिए; केवल processor के नाम से तुलना न करें।', 'RAM और SSD storage की जरूरत अलग-अलग है। Upgrade support भी model के अनुसार बदलता है।', 'Screen size के साथ weight, ports और रोज़ साथ ले जाने की सुविधा समझिए।', 'Keyboard, webcam और display का अनुभव देखें। Heavy work में battery backup सामान्य browsing से अलग हो सकता है।'],
    faq: [['क्या सभी configurations दुकान पर मिलेंगी?', 'नहीं, catalogue में दिखती category stock की गारंटी नहीं है। अपनी preferred configuration भेजकर availability की पुष्टि कीजिए।'], ['Laptop या tablet में कैसे चुनें?', 'Desktop software, typing और कई apps साथ चलाना हो तो laptop की जरूरत अलग होगी। Reading, notes और हल्के काम के लिए tablet की compatibility देखिए।'], ['EMI की जानकारी कहाँ मिलेगी?', 'Finance page पर documents और उपलब्ध finance तरीकों की जानकारी है। Approval और अंतिम शर्तें bank या lender तय करता है।']],
  },
  televisions: {
    title: 'Televisions in Jawahar Colony, Faridabad', heading: 'आपके कमरे के हिसाब से TV।',
    description: 'Mobile World, Jawahar Colony में TV चुनने से पहले screen size, viewing distance, apps और connections समझिए। उपलब्ध models और brand installation की जानकारी लीजिए।',
    intro: 'TV खरीदते समय बड़ी screen के साथ बैठने की दूरी, कमरे की रोशनी और रोज़ देखे जाने वाले content को भी ध्यान में रखिए। अपनी जगह और जरूरत बताइए; दुकान आने से पहले उपलब्ध models के बारे में बात कर लीजिए।',
    points: ['जहाँ TV रखना है उसकी चौड़ाई और बैठने की दूरी नापकर आइए।', 'Display को सामान्य content के साथ देखें; सिर्फ चमकदार demo video पर फैसला न करें।', 'आपकी जरूरी streaming apps, Wi-Fi और HDMI devices की compatibility जाँचिए।', 'Sound, remote और menu का इस्तेमाल समझिए। Gaming के लिए संबंधित inputs और refresh-rate support अलग से देखिए।'],
    faq: [['क्या दुकान TV install करती है?', 'Installation दुकान की service नहीं है। संबंधित brand के service centre की प्रक्रिया, उपलब्धता और लागू charges की जानकारी खरीदारी के समय लें।'], ['Delivery के बारे में कैसे पता चलेगा?', 'अपनी locality और product बताकर delivery की उपलब्धता तथा शर्तें team से पूछिए।'], ['क्या website पर दिखता model तुरंत मिलेगा?', 'Model और size का stock बदल सकता है। दुकान आने से पहले अपनी पसंद की availability की पुष्टि कर लें।']],
  },
} as const;
export type GuideCategory = keyof typeof categoryGuides;
export function categoryHref(slug: string) { return slug in categoryGuides ? `/products/${slug}` : `/products#${slug}`; }
