const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'messages');
const files = ['en.json', 'vi.json', 'ja.json', 'ko.json', 'zh.json'];

// Global replacements (Regexes)
const globalReplacements = [
  { regex: /Ticktoc Kimono Rental/g, to: 'Kyo kimono rental &nail' },
  { regex: /Ticktoc Kimono/g, to: 'Kyo kimono rental &nail' },
  { regex: /Ticktoc/g, to: 'Kyo kimono rental &nail' },
  { regex: /hello@ticktockimono\.vn/g, to: 'contact@kyokimono.com' },
  { regex: /0901 234 567/g, to: '+81-000-000-000' }, // placeholder since no new phone given
];

const localeReplacements = {
  en: [
    { regex: /Saigon/gi, to: 'Kyoto' },
    { regex: /Ho Chi Minh City/gi, to: 'Kyoto' },
  ],
  vi: [
    { regex: /Sài Gòn/gi, to: 'Kyoto' },
    { regex: /TP\. Hồ Chí Minh/gi, to: 'Kyoto' },
  ],
  ja: [
    { regex: /サイゴン/g, to: '京都' },
    { regex: /ホーチミン市/g, to: '京都市' },
  ],
  ko: [
    { regex: /사이공/g, to: '교토' },
    { regex: /호치민시/g, to: '교토시' },
  ],
  zh: [
    { regex: /西贡/g, to: '京都' },
    { regex: /胡志明市/g, to: '京都市' },
  ]
};

// SEO Custom Overrides
const customOverrides = {
  en: {
    "metadata.title": "Kyo kimono rental &nail - Premium Kimono Rental in Kyoto",
    "metadata.description": "Best kimono rental service in Gion, Kyoto. Wide variety of traditional kimonos, professional hair styling, and photo packages.",
    "hero.title": "Premium Kimono Rental in Kyoto",
    "hero.subtitle": "Experience the beauty of traditional Japanese culture in the heart of Gion, Kyoto with our diverse kimono collection, professional hair styling, and photography services.",
    "faq.a8": "Kyo kimono rental &nail is located in Gion, Kyoto - the heart of Japan's traditional culture, near famous landmarks like Kiyomizu-dera Temple and Yasaka Shrine. Address: 京都市東山区祇園町北側 347-25 3階",
    "about.title": "Premium Kimono Rental Service in Gion, Kyoto",
    "about.p1": "Kyo kimono rental &nail is a premier kimono rental shop located in Gion, Kyoto. With over 200 genuine kimonos, we offer a diverse selection from traditional to modern styles - suitable for women, men, and children.",
    "about.p2": "Our professional team will help you dress properly, style your hair perfectly, and arrange photography. Whether you're strolling through Kyoto, visiting Kiyomizu-dera, or attending an event, Kyo kimono rental &nail is ready to help you create unforgettable moments.",
    "contact.addressValue": "京都市東山区祇園町北側 347-25 3階",
    "footer.description": "Premium kimono rental service in Kyoto, Japan. Experience the beauty of traditional Japanese culture in Gion."
  },
  vi: {
    "metadata.title": "Kyo kimono rental &nail - Cho Thuê Kimono Đẹp Tại Kyoto",
    "metadata.description": "Dịch vụ cho thuê kimono uy tín tại Gion, Kyoto. Đa dạng mẫu mã truyền thống, dịch vụ làm tóc chỉnh chu và nhiếp ảnh chuyên nghiệp.",
    "hero.title": "Thuê Kimono & Làm Tóc Tại Kyoto",
    "hero.subtitle": "Trải nghiệm vẻ đẹp văn hóa truyền thống Nhật Bản ngay giữa lòng Gion, Kyoto với bộ sưu tập kimono đa dạng, dịch vụ làm tóc và chụp ảnh chuyên nghiệp.",
    "faq.a8": "Kyo kimono rental &nail tọa lạc tại Gion, Kyoto - trung tâm văn hóa Nhật Bản, gần Chùa Thanh Thủy (Kiyomizu-dera) và Đền Yasaka. Địa chỉ: 京都市東山区祇園町北側 347-25 3階.",
    "about.title": "Dịch Vụ Cho Thuê Kimono Cao Cấp Tại Kyoto",
    "about.p1": "Kyo kimono rental &nail là cửa hàng cho thuê kimono cao cấp tại Gion, Kyoto. Với hơn 200 bộ kimono chính hãng, chúng tôi cung cấp các mẫu mã đa dạng từ truyền thống đến hiện đại - dành cho cả nam, nữ và trẻ em.",
    "about.p2": "Đội ngũ chuyên nghiệp của chúng tôi sẽ hỗ trợ bạn mặc kimono đúng chuẩn, làm tóc đẹp mắt và các gói chụp hình lưu niệm. Dù dạo phố Kyoto hay dự sự kiện đặc biệt, Kyo kimono rental &nail luôn sẵn sàng đồng hành cùng bạn.",
    "contact.addressValue": "京都市東山区祇園町北側 347-25 3階",
    "footer.description": "Dịch vụ cho thuê kimono chuyên nghiệp tại Kyoto, Nhật Bản. Trải nghiệm vẻ đẹp Nhật Bản đích thực tại Gion."
  },
  ja: {
    "metadata.title": "Kyo kimono rental &nail - 京都・祇園の着物レンタル",
    "metadata.description": "京都祇園の本格着物レンタル店。伝統的な着物からモダンな柄まで豊富にご用意。プロによるヘアセットや写真撮影サービスも承ります。",
    "hero.title": "京都・祇園で本格着物レンタル",
    "hero.subtitle": "100種類以上の豊富な着物とプロのヘアセット、写真撮影サービスで、京都での特別な思い出作りをサポートします。",
    "faq.a8": "Kyo kimono rental &nailは、清水寺や八坂神社など京都の有名な観光地に近い祇園に位置しています。住所：京都市東山区祇園町北側 347-25 3階",
    "about.title": "京都・祇園のプレミアム着物レンタル",
    "about.p1": "Kyo kimono rental &nailは、京都祇園にあるプレミアムな着物レンタルショップです。200着以上の本格的な着物を取り揃え、伝統的なスタイルからモダンなデザインまで、女性、男性、お子様向けに豊富にご用意しています。",
    "about.p2": "プロのスタッフが着付け、ヘアセット、そして写真撮影を行います。京都の歴史ある街並みを散策したり、特別なイベントに参加したり、皆様の忘れられない思い出作りを全力でサポートいたします。",
    "contact.addressValue": "京都市東山区祇園町北側 347-25 3階",
    "footer.description": "京都・祇園のプレミアム着物レンタルサービス。日本の伝統美をご体験ください。"
  },
  ko: {
    "metadata.title": "Kyo kimono rental &nail - 교토 기온 기모노 대여",
    "metadata.description": "교토 기온 최고의 기모노 대여 서비스. 다양한 전통 기모노, 전문 헤어 스타일링 및 사진 촬영 패키지를 제공합니다.",
    "hero.title": "교토 프리미엄 기모노 대여",
    "hero.subtitle": "다양한 기모노 컬렉션, 전문 헤어 스타일링, 사진 촬영 서비스로 교토 기온 한가운데서 일본 전통 문화의 아름다움을 경험하세요.",
    "faq.a8": "Kyo kimono rental &nail은 기요미즈데라, 야사카 신사 등 유명 관광지와 가까운 교토 기온에 위치하고 있습니다. 주소: 京都市東山区祇園町北側 347-25 3階",
    "about.title": "교토 기온 프리미엄 기모노 대여 서비스",
    "about.p1": "Kyo kimono rental &nail은 교토 기온에 위치한 프리미엄 기모노 대여점입니다. 200여 벌의 정품 기모노를 보유하고 있으며 여성, 남성, 어린이를 위한 전통 스타일부터 모던 스타일까지 다양하게 제공합니다.",
    "about.p2": "전문 팀이 올바른 기모노 착용, 완벽한 헤어 스타일링 및 사진 촬영을 도와드립니다. 교토의 역사적인 거리를 산책하든 특별한 이벤트에 참석하든 잊지 못할 추억을 만들어 드립니다.",
    "contact.addressValue": "京都市東山区祇園町北側 347-25 3階",
    "footer.description": "일본 교토의 프리미엄 기모노 대여 서비스. 기온에서 일본 전통 문화의 아름다움을 경험하세요."
  },
  zh: {
    "metadata.title": "Kyo kimono rental &nail - 京都祇园高级和服租赁",
    "metadata.description": "京都祇园提供最优质的和服租赁服务。我们拥有各种传统和服、专业的发型设计和摄影套餐。",
    "hero.title": "京都高级和服租赁",
    "hero.subtitle": "通过我们多样化的和服收藏、专业的发型设计和摄影服务，在京都祇园中心体验日本传统文化之美。",
    "faq.a8": "Kyo kimono rental &nail 位于京都祇园，邻近清水寺和八坂神社等著名景点。地址：京都市東山区祇園町北側 347-25 3階",
    "about.title": "京都祇园高级和服租赁服务",
    "about.p1": "Kyo kimono rental &nail 是一家位于京都祇园的高级和服租赁店。我们拥有200多套正宗和服，从传统到现代风格应有尽有，适合女性、男性和儿童。",
    "about.p2": "我们的专业团队将帮助您正确穿着和服、设计发型，并安排摄影服务。无论您是在京都漫步还是参加特别活动，我们都准备好帮助您创造难忘的回忆。",
    "contact.addressValue": "京都市東山区祇園町北側 347-25 3階",
    "footer.description": "日本京都提供高级和服租赁服务。在祇园体验日本传统文化之美。"
  }
};

function processObject(obj, locale) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      let val = obj[key];
      
      // Apply global replaces
      globalReplacements.forEach(rep => {
        val = val.replace(rep.regex, rep.to);
      });
      
      // Apply locale specific replaces
      if (localeReplacements[locale]) {
        localeReplacements[locale].forEach(rep => {
          val = val.replace(rep.regex, rep.to);
        });
      }
      
      obj[key] = val;
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      processObject(obj[key], locale);
    }
  }
}

function applyOverrides(obj, overrides) {
  for (let keyPath in overrides) {
    const parts = keyPath.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
    }
    if (current && parts[parts.length - 1]) {
        current[parts[parts.length - 1]] = overrides[keyPath];
    }
  }
}

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  if (fs.existsSync(filePath)) {
    const locale = file.replace('.json', '');
    let content = fs.readFileSync(filePath, 'utf8');
    let json = JSON.parse(content);
    
    // Process text
    processObject(json, locale);
    
    // Apply overrides
    if (customOverrides[locale]) {
        applyOverrides(json, customOverrides[locale]);
    }
    
    // Write back
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log('Updated ' + file);
  } else {
    console.log('File not found: ' + file);
  }
});
